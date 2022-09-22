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
	uint public lastMemberStatsId;
	uint public memberStatsTableId;
	string public memberStatsTable;

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
		(memberStatsTable, memberStatsTableId) = createTable(
			"member_stats",
			" (id int primary key, wallet text, email text, community_id int, camp_type text, camp_id int, paid string, created_at int);"
		);
	}

	function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

	function createTable(string memory _tableName, string memory _tableStructure) internal onlyOwner returns (string memory, uint) {
		string memory _baseName = string.concat(_tableName, "_", Strings.toString(block.chainid));
		uint _tableId = tableland.createTable(
			address(this),
			string.concat(
				"CREATE TABLE ",
				_baseName,
				_tableStructure
			)
		);
		return (string.concat(_baseName, "_", Strings.toString(_tableId)), _tableId);
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

	// Add member stats into tableland
	function addMemberStats(address _member, string memory _email, uint _communityId, string memory _campType, uint _campId, uint _paid) external {
		Community storage community = communities[_communityId];
		// Allow access only for users contracts
		require(msg.sender == community.nftContract || msg.sender == community.ftContract, "No Access for this action");

		lastMemberStatsId += 1;
		tableland.runSQL(
			address(this),
			memberStatsTableId,
			string.concat(
				"INSERT INTO ",
				memberStatsTable,
				" (id, wallet, email, community_id, camp_type, camp_id, paid, created_at) VALUES (",
				Strings.toString(lastMemberStatsId),
				", '", Strings.toHexString(uint256(uint160(_member)), 20),
				"', '", _email,
				"', ", Strings.toString(_communityId),
				", '", _campType,
				"', ", Strings.toString(_campId),
				", '", Strings.toString(_paid),
				"', ", Strings.toString(block.timestamp),
				");"
			)
		);
	}

}
