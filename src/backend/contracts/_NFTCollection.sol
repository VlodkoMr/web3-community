// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTCollection is ERC1155, Ownable, Pausable, ERC1155Supply {
  string public name;
  string public symbol;
  uint public collectionsTotal;
  Collection[] public collections;

  struct Collection {
    uint id;
    uint price;
    uint supply;
    uint mintedTotal;
    string uri;
  }

  constructor(address _owner) ERC1155("") {
    transferOwnership(_owner);
  }

  function uri(uint _tokenId) override public view returns (string memory) {
    string memory collectionURI = collections[_tokenId - 1].uri;
    return string(
      abi.encodePacked(
        "https://ipfs.io/ipfs/",
        collectionURI,
        "/",
        Strings.toString(_tokenId),
        ".json"
      )
    );
  }

  function setURI(string memory _newUri) public onlyOwner {
    _setURI(_newUri);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  // Add NFT to collection
  function newCollectionItem(string memory _uri, uint _price, uint _supply) public onlyOwner {
    require(bytes(_uri).length > 0, "Wrong URI");
    require(_price >= 0, "Wrong Price");
    require(_supply >= 0, "Wrong Supply");

    collectionsTotal += 1;
    collections.push(
      Collection(
        collectionsTotal,
        _price,
        _supply,
        0,
        _uri
      )
    );
  }

  function updateCollectionItem(uint _collectionId, uint _price, uint _supply) public onlyOwner {
    require(_collectionId <= collectionsTotal, "Wrong Collection");
    require(_price >= 0, "Wrong Price");
    require(_supply >= 0, "Wrong Supply");

    Collection storage collection = collections[_collectionId - 1];
    if (_supply > 0) {
      // Allow unlimited supply, but check minted amount
      require(_supply >= collection.mintedTotal, "Supply is less that already minted");
    }

    collection.price = _price;
    collection.supply = _supply;
  }

  function getCollections() public view returns (Collection[] memory) {
    return collections;
  }

  // Mint NFTs for owner
  function mint(address _account, uint256 _collectionId, uint256 _amount) public onlyOwner {
    require(_amount > 0, "Wrong mint amount");
    require(_collectionId > 0, "Wrong Collection");
    require(_collectionId <= collectionsTotal, "Wrong Collection");
    require(_account != address(0), "Wrong destination wallet Address");

    Collection storage collection = collections[_collectionId - 1];
    if (collection.supply > 0) {
      require(collection.supply >= collection.mintedTotal + _amount, "Not enough supply left");
    }

    collection.mintedTotal += _amount;
    _mint(_account, _collectionId, _amount, "");
  }

  // Mint NFTs for other
  function payToMint(uint _collectionId, uint256 _amount) public whenNotPaused payable {
    require(_amount > 0, "Wrong mint amount");
    require(_collectionId > 0, "Wrong Collection");
    require(_collectionId <= collectionsTotal, "Wrong Collection");

    Collection storage collection = collections[_collectionId - 1];
    if (collection.supply > 0) {
      require(collection.supply >= collection.mintedTotal + _amount, "Not enough supply left");
    }
    if (collection.price > 0) {
      uint totalPrice = _amount * collection.price;
      require(msg.value >= totalPrice, "Wrong payment amount");
    } else {
      require(_amount == 1, "You can't mint more than 1 NFT");
      // TODO: limit free NFT to mint 1 per acc
    }

    collection.mintedTotal += _amount;
    _mint(msg.sender, _collectionId, _amount, "");
  }

  function _beforeTokenTransfer(address _operator, address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory _data)
  internal
  whenNotPaused
  override(ERC1155, ERC1155Supply)
  {
    super._beforeTokenTransfer(_operator, _from, _to, _ids, _amounts, _data);
  }
}
