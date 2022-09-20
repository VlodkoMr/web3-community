// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../abstract/utils.sol";

contract FungibleToken is ERC20, Pausable, Ownable, Utils {
	uint public campaignLastId;
	DistributionCampaign[] distributionCampaigns;

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
		bool isProtected;
	}

	constructor(string memory _name, string memory _symbol, address _owner, uint _supply) ERC20(_name, _symbol) {
		_mint(_owner, _supply * 1e18);
		transferOwnership(_owner);
	}

	function pause() public onlyOwner {
		_pause();
	}

	function unpause() public onlyOwner {
		_unpause();
	}

	function _beforeTokenTransfer(address from, address to, uint256 amount)
	internal
	whenNotPaused
	override
	{
		super._beforeTokenTransfer(from, to, amount);
	}

	// New distribution campaign
	function createDistributionCampaign(
		DistributionType _distType, uint _dateStart, uint _dateEnd, address[] memory _whitelist, bool _isProtected, uint _tokensTotal, uint _tokensPerUser
	) public payable onlyOwner {
		require(_dateStart <= _dateEnd, "Wrong campaign date range");

		uint _randomNumber = 0;
		if (_distType == DistributionType.Event) {
			_randomNumber = Utils.randomNumber(999999, 1);
		}

		IERC20(address(this)).transferFrom(msg.sender, address(this), _tokensTotal);

		campaignLastId += 1;
		distributionCampaigns.push(
			DistributionCampaign(
				campaignLastId,
				_tokensTotal,
				0,
				_tokensPerUser,
				_dateStart,
				_dateEnd,
				_randomNumber,
				_distType,
				_whitelist,
				_isProtected
			)
		);
	}

	// Get all distribution campaigns
	function getCampaigns() public view returns (DistributionCampaign[] memory) {
		return distributionCampaigns;
	}

	// Cancel distribution campaign
	function cancelDistributionCampaign(uint _campaignId) public onlyOwner {
		DistributionCampaign memory _campaign;
		for (uint _i = 0; _i < campaignLastId; ++_i) {
			if (distributionCampaigns[_i].id == _campaignId) {
				_campaign = distributionCampaigns[_i];
				if (distributionCampaigns.length > 1) {
					distributionCampaigns[_i] = distributionCampaigns[campaignLastId - 1];
				}
				distributionCampaigns.pop();
			}
		}

		// return unused tokens
		uint _returnAmount = _campaign.tokensTotal - _campaign.tokensMinted;
		if (_returnAmount > 0) {
			IERC20(address(this)).transfer(msg.sender, _returnAmount);
		}
	}
}
