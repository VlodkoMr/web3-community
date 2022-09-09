// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "../abstract/utils.sol";

contract MainContract is Initializable, OwnableUpgradeable, UUPSUpgradeable, Utils {
  address factoryContractAddress;
  uint public communityCount;

  mapping(address => Community[]) public communityList;
  mapping(CommunityCategory => uint[]) public communityCategory;

  enum CommunityPrivacy {
    Public,
    Private
  }

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

  function updateFactoryContractAddress(address _factoryContractAddress) public onlyOwner {
    factoryContractAddress = _factoryContractAddress;
  }

  // Add new community
  function createCommunity(
    string memory _name, CommunityCategory _category, CommunityPrivacy _privacy, string memory _description, string memory _logo
  ) public {
    require(bytes(_name).length > 3, "Community name too short");

    communityCount += 1;
    communityList[msg.sender].push(
      Community(
        communityCount, _category, _privacy, _name, _description, _logo, msg.sender, address(0), address(0)
      )
    );
  }

  // Update community
  function updateCommunity(
    uint _id, string memory _name, CommunityCategory _category, CommunityPrivacy _privacy, string memory _description, string memory _logo
  ) public {
    require(bytes(_name).length > 3, "Community name too short");

    (uint _index,,) = getCommunityDetailsById(msg.sender, _id);
    Community storage userCommunity = communityList[msg.sender][_index];
    require(userCommunity.owner == msg.sender, "No access to community");

    userCommunity.name = _name;
    userCommunity.category = _category;
    userCommunity.privacy = _privacy;
    userCommunity.description = _description;
    userCommunity.logo = _logo;
  }

  function getUserCommunities(address _owner) public view returns (Community[] memory) {
    return communityList[_owner];
  }

  //  function getCommunityById(address _owner, uint _id) public view returns (Community memory) {
  //    Community memory _community;
  //    for (uint _i = 0; _i < communityList[_owner].length; ++_i) {
  //      if (communityList[_owner][_i].id == _id) {
  //        _community = communityList[_owner][_i];
  //      }
  //    }
  //
  //    require(_community.id != 0, "Community not found");
  //    return _community;
  //  }

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
    require(msg.sender == factoryContractAddress, "No Access for this action");
    communityList[_owner][_index].nftContract = _nftContract;
  }

  function updateCommunityFT(address _owner, uint _index, address _ftContract) external {
    require(msg.sender == factoryContractAddress, "No Access for this action");
    communityList[_owner][_index].ftContract = _ftContract;
  }

}