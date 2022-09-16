// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFTCollection is ERC1155, Ownable, Pausable, ERC1155Supply {
  string public name;
  string public symbol;
  uint public collectionsTotal;
  Collection[] public collections;

  enum DistributionCampaign {

  }

  struct CollectionRoyalty {
    address account;
    uint percent;
  }

  struct Collection {
    string title;
    string jsonUri;
    string mediaUri;
    uint id;
    uint price;
    uint supply;
    uint mintedTotal;
    CollectionRoyalty royalty;
  }

  constructor(string memory _name, string memory _symbol, address _owner) ERC1155("") {
    transferOwnership(_owner);
    name = _name;
    symbol = _symbol;
  }

  function uri(uint _tokenId) override public view returns (string memory) {
    Collection storage collection = collections[_tokenId - 1];
    return collection.jsonUri;
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
  function newCollectionItem(
    string memory _jsonUri, string memory _mediaUri, string memory _title, uint _price, uint _supply, CollectionRoyalty memory _royalty
  ) public onlyOwner {
    require(bytes(_jsonUri).length > 0, "Wrong json URI");
    require(bytes(_mediaUri).length > 0, "Wrong media URI");
    require(_price >= 0, "Wrong Price");
    require(_supply >= 0, "Wrong Supply");
    if (_royalty.account != address(0)) {
      require(_royalty.percent > 0, "Please provide royalty percent");
      require(_royalty.percent <= 90, "Royalty percent can't be more than 90%");
    }

    collectionsTotal += 1;
    collections.push(Collection(
        _title,
        _jsonUri,
        _mediaUri,
        collectionsTotal,
        _price,
        _supply,
        0,
        _royalty
      ));
  }

  function updateCollectionItem(uint _collectionId, uint _price, uint _supply, CollectionRoyalty memory _royalty) public onlyOwner {
    require(_collectionId <= collectionsTotal, "Wrong Collection");
    require(_price >= 0, "Wrong Price");
    require(_supply >= 0, "Wrong Supply");

    Collection storage collection = collections[_collectionId - 1];
    if (_supply > 0) {
      // Allow unlimited supply, but check minted amount
      require(_supply >= collection.mintedTotal, "Supply is less that already minted");
    }
    if (_royalty.account != address(0)) {
      require(_royalty.percent > 0, "Please provide royalty percent");
      require(_royalty.percent <= 90, "Royalty percent can't be more than 90%");
    }

    collection.price = _price;
    collection.supply = _supply;
    collection.royalty = _royalty;
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
