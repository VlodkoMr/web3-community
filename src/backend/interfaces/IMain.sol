// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IMain {
	function isContractExists(uint) external view returns (bool, bool);

	function updateCommunityNFT(uint, address) external;

	function updateCommunityFT(uint, address) external;

	function updateMemberContract(uint, address) external;
}
