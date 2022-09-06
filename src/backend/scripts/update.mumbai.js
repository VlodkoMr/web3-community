const hre = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const CONTRACT_PROXY = "0x20735732636Ea481D46f8B5F0c01B74Ea2c69A10";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const RestoreTogetherNFTv2 = await hre.ethers.getContractFactory("RestoreTogetherNFT");
  const restoreTogetherNFT = await hre.upgrades.upgradeProxy(CONTRACT_PROXY, RestoreTogetherNFTv2);

  console.log('Contract upgraded');

  saveFrontendFiles(restoreTogetherNFT, "RestoreTogetherNFT");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
