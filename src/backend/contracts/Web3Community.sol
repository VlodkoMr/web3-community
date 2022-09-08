// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../abstract/utils.sol";

contract Web3Community is Initializable, OwnableUpgradeable, UUPSUpgradeable, Utils {
	uint public communityCount;

	mapping(address => Community[]) public communityList;

	struct Community {
		uint id;
		string name;
		string description;
		string logo;
		address nftContract;
		address ftContract;
	}

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize() initializer public {
		__Ownable_init();
		__UUPSUpgradeable_init();
	}

	function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

	function createCommunity(string memory _name, string memory _description, string memory _logo) public {
		communityCount += 1;
		communityList[msg.sender].push(
			Community(
				communityCount, _name, _description, _logo, address(0), address(0)
			)
		);
	}

	function getUserCommunities(address _owner) public view returns (Community[] memory) {
		return communityList[_owner];
		//    uint _totalCount = communityList[_owner].length;
		//    Community[] memory _result = new Community[](_totalCount);
		//    for (uint _i = 0; _i < _listId.length; ++_i) {
		//      result[_i] = communityList[_owner];
		//    }
		//    return _result;
	}

}
