const hre = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const CONTRACT_PROXY = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Web3Community = await hre.ethers.getContractFactory("Web3Community");
  const web3Community = await hre.upgrades.upgradeProxy(CONTRACT_PROXY, Web3Community);

  console.log('Contract upgraded');

  saveFrontendFiles(web3Community, "Web3Community");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
