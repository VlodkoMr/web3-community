const hre = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const CONTRACT_PROXY = "0xEDE2eDf1A0eB671C4F88f5715A17D9320a3167DA";

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
