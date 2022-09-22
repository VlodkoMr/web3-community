// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@tableland/evm/contracts/ITablelandTables.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MembersContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
	ITablelandTables private _tableland;
	string private _metadataTable;
	uint256 private _metadataTableId;
	string private _tablePrefix;

	address mainContractAddress;
	address registryContractAddress;

	//	address mainContractAddress;
	//	address registryContractAddress;
	//	ITablelandTables private _tableland;
	//	uint private _metadataTableId;
	//	string private _metadataTable;
	//	//	ITablelandTables internal _tableland;
	//	string internal _tablePrefix;
	//	//	string internal _memberStatsPrefix;
	//	//	mapping(uint => uint) internal _communityMembersCounter;
	//	//	mapping(uint => uint) internal _communityMemberStatsCounter;
	//
	//	//	string public membersTableName;
	//	//	uint internal _membersTableId;
	//	//	uint internal _membersCounter;
	//	//	string public memberStatsTableName;
	//	//	uint internal _memberStatsTableId;
	//	//	uint internal _memberStatsCounter;

	/// @custom:oz-upgrades-unsafe-allow constructor
	constructor() {
		_disableInitializers();
	}

	function initialize(address _mainContractAddress, address _registry) initializer public {
		__Ownable_init();
		__UUPSUpgradeable_init();

		mainContractAddress = _mainContractAddress;
		registryContractAddress = _registry;
		_tablePrefix = "canvass";


		//		_tablePrefix = "members";
		//		_memberStatsPrefix = "member_stats";
		_tableland = ITablelandTables(registryContractAddress);
		/*
      * Stores the unique ID for the newly created table.
      */
		_metadataTableId = _tableland.createTable(
			address(this),
			string.concat(
				"CREATE TABLE ",
				_tablePrefix,
				"_",
				Strings.toString(block.chainid),
				" (id int, external_link text, x int, y int);"
			)
		);

		/*
		* Stores the full tablename for the new table.
		* {prefix}_{chainid}_{tableid}
		*/
		_metadataTable = string.concat(
			_tablePrefix,
			"_",
			Strings.toString(block.chainid),
			"_",
			Strings.toString(_metadataTableId)
		);

	}

	function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

	// ------------- Create tables -------------

	function createMemberTable(uint _communityId) external payable returns (string memory) {
		//		string memory _baseName = string.concat(
		//			_tablePrefix,
		//			Strings.toString(_communityId),
		//			"_",
		//			Strings.toString(block.chainid));
		//		uint _tableId = _tableland.createTable(
		//			address(this),
		//			string.concat(
		//				"CREATE TABLE ",
		//				_baseName,
		//				" (id INTEGER primary key, wallet TEXT, email TEXT, created_at INTEGER);"
		//			)
		//		);
		//		return string.concat(
		//			_baseName,
		//			"_",
		//			Strings.toString(_tableId)
		//		);
		_tableland = ITablelandTables(registryContractAddress);
		/*
      * Stores the unique ID for the newly created table.
      */
		_tableland.runSQL(
			address(this),
			_metadataTableId,
			string.concat(
				"INSERT INTO ",
				_metadataTable,
				" (id, external_link, x, y) VALUES (",
				Strings.toString(_communityId),
				", 'not.implemented.xyz', 0, 0)"
			)
		);

		return Strings.toString(_communityId);
//		_metadataTableId = _tableland.createTable(
//			address(this),
//			string.concat(
//				"CREATE TABLE ",
//				_tablePrefix,
//				"_",
//				Strings.toString(block.chainid),
//				" (id int, external_link text, x int, y int);"
//			)
//		);
//
//		/*
//		* Stores the full tablename for the new table.
//		* {prefix}_{chainid}_{tableid}
//		*/
//		_metadataTable = string.concat(
//			_tablePrefix,
//			"_",
//			Strings.toString(block.chainid),
//			"_",
//			Strings.toString(_metadataTableId)
//		);

//		return _metadataTable;
	}

	//	function createMemberStatsTable(uint _communityId) external payable returns (string memory) {
	//		string memory _baseName = string.concat(
	//			_memberStatsPrefix,
	//			Strings.toString(_communityId),
	//			"_",
	//			Strings.toString(block.chainid));
	//
	//		uint _tableId = _tableland.createTable(
	//			address(this),
	//			string.concat(
	//				"CREATE TABLE ",
	//				_baseName,
	//				" (id INTEGER primary key, member_id INTEGER, camp_type TEXT, camp_id INTEGER,",
	//				" paid TEXT, action TEXT, is_new_member INT8, created_at INTEGER);"
	//			)
	//		);
	//
	//		return string.concat(
	//			_baseName,
	//			"_",
	//			Strings.toString(_tableId)
	//		);
	//	}

}
