// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MainContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
	address factoryNFTContract;
	address factoryFTContract;
	uint public communityCount;
	mapping(address => Community[]) public communityList;
	mapping(CommunityCategory => uint[]) public communityCategories;

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
		string memory _name, CommunityCategory _category, CommunityPrivacy _privacy, string memory _description
	) public {
		require(bytes(_name).length > 3, "Community name too short");

		communityCount += 1;
		communityList[msg.sender].push(
			Community(
				communityCount, _category, _privacy, _name, _description, "", msg.sender, address(0), address(0)
			)
		);

		communityCategories[_category].push(communityCount);
	}

	// Update community
	function updateCommunity(
		uint _id, string memory _name, CommunityPrivacy _privacy, string memory _description
	) public {
		require(bytes(_name).length >= 3, "Community name too short");

		(uint _index,,) = getCommunityDetailsById(msg.sender, _id);
		Community storage userCommunity = communityList[msg.sender][_index];
		require(userCommunity.owner == msg.sender, "No access to community");

		userCommunity.name = _name;
		userCommunity.privacy = _privacy;
		userCommunity.description = _description;
	}

	function getUserCommunities(address _owner) public view returns (Community[] memory) {
		return communityList[_owner];
	}

	function getCommunityDetailsById(address _owner, uint _id) public view returns (uint, address, address) {
		uint _communityIndex;
		Community memory _community;
		for (uint _i = 0; _i < communityList[_owner].length; ++_i) {
			if (communityList[_owner][_i].id == _id) {
				_community = communityList[_owner][_i];
				_communityIndex = _i;
			}
		}

		require(_community.id > 0, "Community not found");
		return (_communityIndex, _community.nftContract, _community.ftContract);
	}

	function updateCommunityNFT(address _owner, uint _index, address _nftContract) external {
		require(msg.sender == factoryNFTContract, "No Access for this action");
		communityList[_owner][_index].nftContract = _nftContract;
	}

	function updateCommunityFT(address _owner, uint _index, address _ftContract) external {
		require(msg.sender == factoryFTContract, "No Access for this action");
		communityList[_owner][_index].ftContract = _ftContract;
	}

}
