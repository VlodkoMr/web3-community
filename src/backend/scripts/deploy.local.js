// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { saveFrontendFiles } = require('./utils');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Web3Community = await hre.ethers.getContractFactory("Web3Community");
  const web3Community = await hre.upgrades.deployProxy(Web3Community, [], {
    initializer: "initialize"
  })
  await web3Community.deployed();

  console.log("Deployed to: ", web3Community.address);
  saveFrontendFiles(web3Community, "Web3Community");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
