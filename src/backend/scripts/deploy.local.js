const hre = require("hardhat");
const { saveAllFrontendFiles, saveFrontendArtifact } = require('./utils');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy main contract
  const MainContract = await hre.ethers.getContractFactory("MainContract");
  const mainContract = await hre.upgrades.deployProxy(MainContract, [], {
    initializer: "initialize"
  })
  await mainContract.deployed();

  // Deploy factory contract
  const FactoryContract = await hre.ethers.getContractFactory("FactoryContract");
  const factoryContract = await hre.upgrades.deployProxy(FactoryContract, [mainContract.address], {
    initializer: "initialize"
  })
  await factoryContract.deployed();

  // Update main contract - add factory address
  const MainContractInstance = await hre.ethers.getContractAt("MainContract", mainContract.address);
  await MainContractInstance.updateFactoryContractAddress(factoryContract.address);

  console.log("MainContract address: ", mainContract.address);
  console.log("FactoryContract address: ", factoryContract.address);

  // Save ABI & Address
  saveAllFrontendFiles(mainContract, "MainContract");
  saveAllFrontendFiles(factoryContract, "FactoryContract");

  // Save user contracts ABI
  saveFrontendArtifact("NFTCollection");
  saveFrontendArtifact("FungibleToken");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
