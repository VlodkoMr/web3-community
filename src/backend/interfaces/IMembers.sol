// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IMembers {
	function createMemberTable(uint) external payable returns (string memory);

	function createMemberStatsTable(uint) external payable returns (string memory);
}
