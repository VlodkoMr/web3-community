// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

contract MainContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
	address factoryNFTContract;
	address factoryFTContract;
	ITablelandTables private tableland;

	uint public communityCount;
	string public membersTable;
	string public communityMembersTable;
	string public memberStatsTable;

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
		address owner;
		address nftContract;
		address ftContract;
		address membersContract;
		string name;
		string description;
		string logo;
	}

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize(address _registry) initializer public {
		__Ownable_init();
		__UUPSUpgradeable_init();

		tableland = ITablelandTables(_registry);
		membersTable = createTable(
			"members",
			" (id int primary key, wallet text, email text, phone text, country text, city text);"
		);
		communityMembersTable = createTable(
			"community_members",
			" (id int primary key, member_id int, community_id int, created_at int);"
		);
		memberStatsTable = createTable(
			"member_stats",
			" (id int primary key, member_id int, community_id int, camp_type text, camp_id int, paid string, is_new_member int, created_at int);"
		);
	}


	function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

	function createTable(string memory _tableName, string memory _tableStructure) internal onlyOwner returns (string memory) {
		string memory _baseName = string.concat(_tableName, "_", Strings.toString(block.chainid));
		uint _tableId = tableland.createTable(
			address(this),
			string.concat(
				"CREATE TABLE ",
				_baseName,
				_tableStructure
			)
		);
		return string.concat(_baseName, "_", Strings.toString(_tableId));
	}

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
		uint _id = communityCount;

		communities[_id] = Community(
			_id, _category, _privacy, msg.sender, address(0), address(0), address(0), _name, _description, _logo
		);
		userCommunities[msg.sender].push(_id);
		categoryCommunities[_category].push(_id);
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
