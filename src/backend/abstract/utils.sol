// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

abstract contract Utils {
  function string_compare(string memory _a, string memory _b) private pure returns (int) {
    bytes memory a = bytes(_a);
    bytes memory b = bytes(_b);
    uint minLength = a.length;
    if (b.length < minLength) minLength = b.length;
    for (uint i = 0; i < minLength; ++i)
      if (a[i] < b[i])
        return - 1;
      else if (a[i] > b[i])
        return 1;
    if (a.length < b.length)
      return - 1;
    else if (a.length > b.length)
      return 1;
    else
      return 0;
  }

  function string_equal(string memory _a, string memory _b) internal pure returns (bool) {
    return string_compare(_a, _b) == 0;
  }

  function indexOf(uint[] memory self, uint value) internal pure returns (uint, bool) {
    uint length = self.length;
    for (uint i = 0; i < length; ++i) if (self[i] == value) return (i, true);
    return (0, false);
  }
}
