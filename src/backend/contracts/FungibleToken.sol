// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FungibleToken is ERC20, Pausable, Ownable {
  constructor(string memory _name, string memory _symbol, address _owner, uint _supply) ERC20(_name, _symbol) {
    _mint(_owner, _supply * 1e18);
    transferOwnership(_owner);
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount)
  internal
  whenNotPaused
  override
  {
    super._beforeTokenTransfer(from, to, amount);
  }
}
