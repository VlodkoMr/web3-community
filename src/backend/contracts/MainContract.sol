// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MainContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
	address factoryNFTContract;
	address factoryFTContract;
	uint public communityCount;
	mapping(uint => Community) public communities;
	mapping(address => uint[]) public userCommunities;
	mapping(CommunityCategory => uint[]) public categoryCommunities;

	enum CommunityCategory {
		None,
		Animals,
		Art,
		Brand,
		Business,
		Education,
		Environment,
		Fashion,
		Food,
		Gaming,
		Health,
		Infrastructure,
		Literature,
		Music,
		Photography,
		Science,
		Social,
		Sports,
		Technology,
		VirtualWorlds,
		Other
	}

	enum CommunityPrivacy {
		Public,
		Private
	}

	struct Community {
		uint id;
		CommunityCategory category;
		CommunityPrivacy privacy;
		string name;
		string description;
		string logo;
		address owner;
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

	function updateFactoryContractsAddress(address _factoryNFTContract, address _factoryFTContract) public onlyOwner {
		factoryNFTContract = _factoryNFTContract;
		factoryFTContract = _factoryFTContract;
	}

	// Add new community
	function createCommunity(
		string memory _name, string memory _logo, CommunityCategory _category, CommunityPrivacy _privacy, string memory _description
	) public {
		require(bytes(_name).length > 3, "Community name too short");

		communityCount += 1;
		communities[communityCount] = Community(
			communityCount, _category, _privacy, _name, _description, _logo, msg.sender, address(0), address(0)
		);
		userCommunities[msg.sender].push(communityCount);
		categoryCommunities[_category].push(communityCount);
	}

	// Update community
	function updateCommunity(
		uint _id, string memory _name, string memory _logo, CommunityPrivacy _privacy, string memory _description
	) public {
		require(bytes(_name).length >= 3, "Community name too short");

		Community storage community = communities[_id];
		require(community.owner == msg.sender, "No access to community");

		community.name = _name;
		community.logo = _logo;
		community.privacy = _privacy;
		community.description = _description;
	}

	// Get communities for user
	function getUserCommunities(address _owner) public view returns (Community[] memory) {
		uint _countCommunities = userCommunities[_owner].length;
		Community[] memory result = new Community[](_countCommunities);
		for (uint _i = 0; _i < _countCommunities; ++_i) {
			result[_i] = communities[userCommunities[_owner][_i]];
		}
		return result;
	}

	// Get communities for category
	function getCategoryCommunities(CommunityCategory _categoryId) public view returns (Community[] memory) {
		// TODO: Add pagination
		uint _countCommunities = categoryCommunities[_categoryId].length;
		Community[] memory result = new Community[](_countCommunities);
		for (uint _i = 0; _i < _countCommunities; ++_i) {
			result[_i] = communities[categoryCommunities[_categoryId][_i]];
		}
		return result;
	}

	// Check if contracts exist
	function isContractExists(uint _id) external view returns (bool, bool) {
		bool _isNFT = communities[_id].nftContract != address(0);
		bool _isFT = communities[_id].ftContract != address(0);
		return (_isNFT, _isFT);
	}

	// Update NFT contract address
	function updateCommunityNFT(uint _id, address _nftContract) external {
		require(msg.sender == factoryNFTContract, "No Access for this action");
		communities[_id].nftContract = _nftContract;
	}

	// Update FT contract address
	function updateCommunityFT(uint _id, address _ftContract) external {
		require(msg.sender == factoryFTContract, "No Access for this action");
		communities[_id].ftContract = _ftContract;
	}

}
