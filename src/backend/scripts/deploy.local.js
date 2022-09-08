const hre = require("hardhat");
const { saveAllFrontendFiles, saveFrontendArtifact } = require('./utils');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Web3Community = await hre.ethers.getContractFactory("Web3Community");
  const web3Community = await hre.upgrades.deployProxy(Web3Community, [], {
    initializer: "initialize"
  })
  await web3Community.deployed();

  console.log("Deployed to: ", web3Community.address);

  saveAllFrontendFiles(web3Community, "Web3Community");

  saveFrontendArtifact("NFTCollection");
  saveFrontendArtifact("FungibleToken");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
