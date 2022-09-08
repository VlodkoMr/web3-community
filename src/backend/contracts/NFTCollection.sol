// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTCollection is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable {
  using Counters for Counters.Counter;
  Collection[] public collectionItems;
  uint public collectionItemsTotal;

  struct Collection {
    string uri;
    uint id;
    uint price;
    uint supply;
    uint mintedAmount;
  }

  Counters.Counter private _tokenIdCounter;

  constructor(string memory _name, string memory _symbol, address _owner) ERC721(_name, _symbol) {
    transferOwnership(_owner);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  // Mint NFT and send to address
  function safeMint(address _to, uint _collectionId) public onlyOwner {
    _requireNotPaused();
    require(_collectionId <= collectionItemsTotal, "Wrong Collection");
    require(_to != address(0), "Wrong wallet Address");

    uint _tokenId = _tokenIdCounter.current();
    Collection storage collectionItem = collectionItems[_collectionId - 1];
    collectionItem.mintedAmount += 1;

    _tokenIdCounter.increment();
    _safeMint(_to, _tokenId);
    _setTokenURI(_tokenId, collectionItem.uri);
  }

  // Add NFT to collection
  function newCollectionItem(string memory _uri, uint _price, uint _supply) public onlyOwner {
    require(bytes(_uri).length > 0, "Wrong URI");
    require(_price >= 0, "Wrong Price");
    require(_supply >= 0, "Wrong Supply");

    collectionItemsTotal += 1;
    collectionItems.push(
      Collection(
        _uri,
        collectionItemsTotal,
        _price,
        _supply,
        0
      ));
  }

  // Update NFT in collection
  function updateCollectionItem(uint _collectionId, uint _price, uint _supply) public onlyOwner {
    require(_collectionId <= collectionItemsTotal, "Wrong Collection");
    require(_price >= 0, "Wrong Price");
    require(_supply >= 0, "Wrong Supply");

    Collection storage collectionItem = collectionItems[_collectionId - 1];
    // Allow unlimited supply, but check minted amount
    if (_supply > 0) {
      require(_supply >= collectionItem.mintedAmount, "Supply is less that already minted");
    }

    collectionItem.price = _price;
    collectionItem.supply = _supply;
  }

  function payToMint(uint _collectionId) public payable {
    _requireNotPaused();
    require(_collectionId <= collectionItemsTotal, "Wrong Collection");
    Collection storage collectionItem = collectionItems[_collectionId - 1];

    if (collectionItem.price > 0) {
      require(collectionItem.price == msg.value, "Wrong payment amount to mint");
    }
    if (collectionItem.supply > 0) {
      require(collectionItem.supply > collectionItem.mintedAmount, "All NFT was minted");
    }

    collectionItem.mintedAmount += 1;
    uint256 _tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();
    _safeMint(msg.sender, _tokenId);
    _setTokenURI(_tokenId, collectionItem.uri);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId)
  internal
  whenNotPaused
  override(ERC721, ERC721Enumerable)
  {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  // The following functions are overrides required by Solidity.

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    _requireNotPaused();
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
  public
  view
  override(ERC721, ERC721URIStorage)
  returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
  public
  view
  override(ERC721, ERC721Enumerable)
  returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
