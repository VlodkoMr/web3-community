// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

abstract contract Utils {
  //  function indexOf(uint[] memory self, uint value) internal pure returns (uint, bool) {
  //    uint length = self.length;
  //    for (uint i = 0; i < length; ++i) if (self[i] == value) return (i, true);
  //    return (0, false);
  //  }
	function randomNumber(uint _max, uint8 _shift) internal view returns (uint) {
		return uint(keccak256(abi.encodePacked(_shift, msg.sender, block.difficulty, block.timestamp, uint(1)))) % _max;
	}

}
