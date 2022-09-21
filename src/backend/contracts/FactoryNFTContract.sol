// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../interfaces/IMain.sol";
import "./_NFTCollection.sol";

contract FactoryNFTContract is Initializable, OwnableUpgradeable, UUPSUpgradeable {
  address mainContractAddress;
  NFTCollection[] private contractsNFTList;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address _mainContractAddress) initializer public {
    __Ownable_init();
    __UUPSUpgradeable_init();
    mainContractAddress = _mainContractAddress;
  }

  function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

  // Deploy NFT Collection Contract
  function deployNFTCollectionContract(uint _communityId, string memory _name, string memory _symbol) public {
    require(bytes(_name).length >= 3, "Collection name should be longer than 2 symbols");
    require(bytes(_symbol).length >= 3 && bytes(_symbol).length <= 5, "Symbol length should be 3-5 chars");

    // Check community owner & get contract details
    (bool _isNFTContract,) = IMain(mainContractAddress).isContractExists(_communityId);
    require(!_isNFTContract, "Community already have NFT Contract");

    NFTCollection collection = new NFTCollection(_name, _symbol, msg.sender);
    contractsNFTList.push(collection);

    // Update contract address
    IMain(mainContractAddress).updateCommunityNFT(_communityId, address(collection));
  }
}
