// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {SuperTokenBase} from "./base/SuperTokenBase.sol";

import "../abstract/utils.sol";
import "../interfaces/IMainContract.sol";
import {ByteHasher} from '../helpers/ByteHasher.sol';
import {IWorldID} from '../interfaces/IWorldID.sol';

contract FungibleToken is SuperTokenBase, Pausable, Ownable, Utils {
	using ByteHasher for bytes;
	address mainContractAddress;

	uint public campaignLastId;
	uint[] public campaignsList;
	mapping(uint => DistributionCampaign) distributionCampaigns;

	IWorldID internal worldId;
	uint256 internal immutable groupId = 1;
	mapping(uint => bool) internal nullifierHashes;
	mapping(uint => mapping(address => bool)) public mintedList;

	error InvalidNullifier();

	enum DistributionType {
		None,
		Public,
		Whitelist,
		Email,
		Event,
		CreditCard
	}

	struct DistributionCampaign {
		uint id;
		uint tokensTotal;
		uint tokensMinted;
		uint tokensPerUser;
		uint dateStart;
		uint dateEnd;
		uint eventCode;
		DistributionType distType;
		address[] whitelist;
		string worldcoinAction;
	}

	function initialize(
		address _mainContract, string memory _name, string memory _symbol, address _owner, uint _supply,
		IWorldID _worldId, address _superTokenFactory, bytes memory userData
	) external {
		mainContractAddress = _mainContract;
		_initialize(_name, _symbol, _superTokenFactory);
		_mint(_owner, _supply * 1e18, userData);
		transferOwnership(_owner);
		worldId = _worldId;
	}

	function pause() public onlyOwner {
		_pause();
	}

	function unpause() public onlyOwner {
		_unpause();
	}

	// New distribution campaign
	function createDistributionCampaign(
		DistributionType _distType, uint _dateStart, uint _dateEnd, address[] memory _whitelist, string memory _worldcoinAction, uint _tokensTotal, uint _tokensPerUser
	) public payable onlyOwner {
		require(_dateStart <= _dateEnd, "Wrong campaign date range");

		uint _randomNumber = 0;
		if (_distType == DistributionType.Event) {
			_randomNumber = Utils.randomNumber(999999, 1);
		}

		IERC20(address(this)).transferFrom(msg.sender, address(this), _tokensTotal);

		campaignLastId += 1;
		campaignsList.push(campaignLastId);
		distributionCampaigns[campaignLastId] = DistributionCampaign(
			campaignLastId,
			_tokensTotal,
			0,
			_tokensPerUser,
			_dateStart,
			_dateEnd,
			_randomNumber,
			_distType,
			_whitelist,
			_worldcoinAction
		);
	}

	// Get all distribution campaigns
	function getCampaigns() public view returns (DistributionCampaign[] memory) {
		DistributionCampaign[] memory _campaigns = new DistributionCampaign[](campaignsList.length);
		for (uint _i = 0; _i < campaignsList.length; ++_i) {
			_campaigns[_i] = distributionCampaigns[campaignsList[_i]];
		}
		return _campaigns;
	}

	// Cancel distribution campaign
	function cancelDistributionCampaign(uint _campaignId) public onlyOwner {
		DistributionCampaign memory _campaign = distributionCampaigns[_campaignId];
		uint _returnAmount = _campaign.tokensTotal - _campaign.tokensMinted;

		for (uint _i = 0; _i < campaignsList.length; ++_i) {
			if (campaignsList[_i] == _campaignId) {
				if (campaignsList.length > 1) {
					campaignsList[_i] = campaignsList[campaignsList.length - 1];
				}
				campaignsList.pop();
			}
		}
		delete distributionCampaigns[_campaignId];

		// return unused tokens
		if (_returnAmount > 0) {
			IERC20(address(this)).transfer(msg.sender, _returnAmount);
		}
	}

	function claimFromCampaign(uint _communityId, uint _campaignId, uint _eventCode, string memory _email,
		uint root, uint nullifierHash, uint[8] calldata proof) public whenNotPaused payable {

		DistributionCampaign storage campaign = distributionCampaigns[_campaignId];
		require(campaign.tokensMinted + campaign.tokensPerUser <= campaign.tokensTotal, "Not enough tokens to claim");
		require(mintedList[_campaignId][msg.sender] == false, "You already claim tokens");

		// check worldID
		if (bytes(campaign.worldcoinAction).length > 0) {
			if (nullifierHashes[nullifierHash]) revert InvalidNullifier();
			worldId.verifyProof(
				root,
				groupId,
				abi.encodePacked(msg.sender).hashToField(),
				nullifierHash,
				abi.encodePacked(address(this)).hashToField(),
				proof
			);
			nullifierHashes[nullifierHash] = true;
		}

		// check Event Code
		if (campaign.distType == DistributionType.Event) {
			require(campaign.eventCode == _eventCode, "Wrong Event Code");
		}

		campaign.tokensMinted += campaign.tokensPerUser;
		mintedList[_campaignId][msg.sender] = true;

		// transfer tokens
		IERC20(address(this)).transfer(msg.sender, campaign.tokensPerUser);

		// Add stats to tableland
		IMainContract(mainContractAddress).addMemberStats(msg.sender, _email, _communityId, "FT", _campaignId, campaign.tokensPerUser);
	}

	function approve(address spender, uint256 amount) public returns (bool) {
		address owner = _msgSender();
		_approve(owner, spender, amount);
		return true;
	}

}
