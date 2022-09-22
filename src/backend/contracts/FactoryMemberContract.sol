// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../interfaces/IMain.sol";
import "./_MembersContract.sol";

contract FactoryMembersContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
	address mainContractAddress;
	address tablelandRegistry;
	MembersContract[] private membersContractList;

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize(address _mainContractAddress, address _registry) initializer public {
		__Ownable_init();
		__UUPSUpgradeable_init();
		mainContractAddress = _mainContractAddress;
		tablelandRegistry = _registry;
	}

	function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

	// Deploy NFT Collection Contract
	function deployMembersContract(uint _communityId, string memory _name, string memory _symbol) public {
		(,,bool _isMemberContract) = IMain(mainContractAddress).isContractExists(_communityId);
		require(!_isMemberContract, "Community already have Members Contract");

		MembersContract _contract = new MembersContract(tablelandRegistry);
		membersContractList.push(_contract);

		// Update contract address
		IMain(mainContractAddress).updateMemberContract(_communityId, address(_contract));
	}
}
