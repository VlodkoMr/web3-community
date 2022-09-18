// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

interface IMain {
	function getCommunityDetailsById(address, uint) external view returns (uint, address, address);

	function updateCommunityNFT(address, uint, address) external;

	function updateCommunityFT(address, uint, address) external;
}
