// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "./_NFTCollection.sol";
import "./_FungibleToken.sol";
import "./MainContract.sol";

contract FactoryContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
  address mainContractAddress;
  MainContract mainContract;

  NFTCollection[] private contractsNFTList;
  FungibleToken[] private contractsFTList;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContractAddress) initializer public {
    __Ownable_init();
    __UUPSUpgradeable_init();
    mainContractAddress = _mainContractAddress;
    mainContract = MainContract(_mainContractAddress);
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  // Deploy NFT Collection Contract
  function deployNFTCollectionContract(uint _communityId, string memory _name, string memory _symbol) public {
    require(bytes(_name).length >= 3, "Collection name should be longer than 2 symbols");
    require(bytes(_symbol).length >= 3 && bytes(_symbol).length <= 5, "Symbol length should be 3-5 chars");

    // Check community owner & get contract details
    (uint _index, address _nftContract,) = mainContract.getCommunityDetailsById(msg.sender, _communityId);
    require(_nftContract == address(0), "Community already have NFT Contract");

    NFTCollection collection = new NFTCollection(_name, _symbol, msg.sender);
    contractsNFTList.push(collection);

    // Update contract address
    mainContract.updateCommunityNFT(msg.sender, _index, address(collection));
  }

  // Deploy FT Contract
  function deployFTContract(uint _communityId, string memory _name, string memory _symbol, uint _supply) public {
    require(bytes(_name).length >= 3, "Collection name should be longer than 2 symbols");
    require(bytes(_symbol).length >= 3 && bytes(_symbol).length <= 5, "Symbol length should be 3-5 chars");
    require(_supply > 0, "Wrong supply amount");

    // Check community owner & get contract details
    (uint _index,,address _ftContract) = mainContract.getCommunityDetailsById(msg.sender, _communityId);
    require(_ftContract == address(0), "Community already have FT Contract");

    FungibleToken token = new FungibleToken(_name, _symbol, msg.sender, _supply);
    contractsFTList.push(token);

    // Update contract address
    mainContract.updateCommunityFT(msg.sender, _index, address(token));
  }
}
