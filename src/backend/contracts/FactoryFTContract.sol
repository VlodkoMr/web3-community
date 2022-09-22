// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import { IWorldID } from '../interfaces/IWorldID.sol';
import "../interfaces/IMainContract.sol";
import "./_FungibleToken.sol";

contract FactoryFTContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
	address mainContractAddress;
	FungibleToken[] private contractsFTList;
	IWorldID internal worldId;

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize(address _mainContractAddress, IWorldID _worldId) initializer public {
		__Ownable_init();
		__UUPSUpgradeable_init();
		mainContractAddress = _mainContractAddress;
		worldId = _worldId;
	}

	function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

	// Deploy FT Contract
	function deployFTContract(uint _communityId, string memory _name, string memory _symbol, uint _supply) public {
		require(bytes(_name).length >= 3, "Collection name should be longer than 2 symbols");
		require(bytes(_symbol).length >= 3 && bytes(_symbol).length <= 5, "Symbol length should be 3-5 chars");
		require(_supply > 0, "Wrong supply amount");

		// Check community owner & get contract details
		(,bool _isFTContract) = IMainContract(mainContractAddress).isContractExists(_communityId);
		require(!_isFTContract, "Community already have FT Contract");

		FungibleToken token = new FungibleToken(mainContractAddress, _name, _symbol, msg.sender, _supply, worldId);
		contractsFTList.push(token);

		// Update contract address
		IMainContract(mainContractAddress).updateCommunityFT(_communityId, address(token));
	}
}
