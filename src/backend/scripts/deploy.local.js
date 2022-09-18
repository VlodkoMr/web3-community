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

  // Deploy NFT factory contract
  const FactoryNFTContract = await hre.ethers.getContractFactory("FactoryNFTContract");
  const factoryNFTContract = await hre.upgrades.deployProxy(FactoryNFTContract, [mainContract.address], {
    initializer: "initialize"
  })
  await factoryNFTContract.deployed();

  // Deploy FT factory contract
  const FactoryFTContract = await hre.ethers.getContractFactory("FactoryFTContract");
  const factoryFTContract = await hre.upgrades.deployProxy(FactoryFTContract, [mainContract.address], {
    initializer: "initialize"
  })
  await factoryFTContract.deployed();

  // Update main contract - add factory address
  const MainContractInstance = await hre.ethers.getContractAt("MainContract", mainContract.address);
  await MainContractInstance.updateFactoryContractsAddress(factoryNFTContract.address, factoryFTContract.address);

  console.log("MainContract address: ", mainContract.address);
  console.log("Factory NFTContract address: ", factoryNFTContract.address);
  console.log("Factory FTContract address: ", factoryFTContract.address);

  // Save ABI & Address
  saveAllFrontendFiles(mainContract, "MainContract");
  saveAllFrontendFiles(factoryNFTContract, "FactoryNFTContract");
  saveAllFrontendFiles(factoryFTContract, "FactoryFTContract");

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
