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
import "./NFTCollection.sol";
import "./FungibleToken.sol";

contract Web3Community is Initializable, OwnableUpgradeable, UUPSUpgradeable, Utils {
  uint public communityCount;
  NFTCollection[] private contractsNFTList;
  FungibleToken[] private contractsFTList;

  mapping(address => Community[]) public communityList;

  struct Community {
    uint id;
    string name;
    string description;
    string logo;
    address nftContract;
    address ftContract;
    bool isEnabled;
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
        communityCount, _name, _description, _logo, address(0), address(0), true
      )
    );
  }

  function getUserCommunities(address _owner) public view returns (Community[] memory) {
    return communityList[_owner];
    //        uint _totalCount = communityList[_owner].length;
    //        Community[] memory _result = new Community[](_totalCount);
    //        for (uint _i = 0; _i < _listId.length; ++_i) {
    //          result[_i] = communityList[_owner];
    //        }
    //        return _result;
  }

  function getCommunityById(address _owner, uint _id) public view returns (Community memory, uint) {
    Community memory _community;
    uint _communityIndex;
    for (uint _i = 0; _i < communityList[_owner].length; ++_i) {
      if (communityList[_owner][_i].id == _id) {
        _community = communityList[_owner][_i];
        _communityIndex = _i;
      }
    }

    require(_community.id != 0, "Community not found");
    return (_community, _communityIndex);
  }

  // ----------------- NFT Collections -----------------

  function deployNFTCollectionContract(uint _communityId, string memory _name, string memory _symbol) public {
    require(bytes(_name).length >= 3, "Collection name should be longer than 2 symbols");
    require(bytes(_symbol).length == 3, "Symbol length should be 3 chars");

    (, uint _index) = getCommunityById(msg.sender, _communityId);
    Community[] storage userCommunities = communityList[msg.sender];
    require(userCommunities[_index].nftContract == address(0), "Community already have NFT Contract");

    NFTCollection collection = new NFTCollection(_name, _symbol, msg.sender);
    userCommunities[_index].nftContract = address(collection);
    contractsNFTList.push(collection);
  }

  // ----------------- FT Collections -----------------

  function deployFTContract(uint _communityId, string memory _name, string memory _symbol, uint _supply) public {
    require(bytes(_name).length >= 3, "Collection name should be longer than 2 symbols");
    require(bytes(_symbol).length >= 3 && bytes(_symbol).length <= 5, "Symbol length should be 3-5 chars");
    require(_supply > 0, "Wrong supply amount");

    (, uint _index) = getCommunityById(msg.sender, _communityId);
    Community[] storage userCommunities = communityList[msg.sender];
    require(userCommunities[_index].ftContract == address(0), "Community already have FT Contract");

    FungibleToken ftContract = new FungibleToken(_name, _symbol, msg.sender, _supply);
    userCommunities[_index].ftContract = address(ftContract);
    contractsFTList.push(ftContract);
  }
}
