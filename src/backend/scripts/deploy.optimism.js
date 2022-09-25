const hre = require("hardhat");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


const { saveAllFrontendFiles, saveFrontendArtifact } = require('./utils');

const TABLELAND_CONTRACT = "0xC72E8a7Be04f2469f8C2dB3F1BdF69A7D516aBbA";
const SUPER_TOKEN_FACTORY = "0x9aCc39d15e3f168c111a1D4F80271a9E526c9a9F";

async function main() {

  const worldIDAddress = await fetch('https://developer.worldcoin.org/api/v1/contracts')
    .then(res => res.json().then(res => res.find(({ key }) => key === 'staging.semaphore.wld.eth').value));

  console.log(`worldIDAddress`, worldIDAddress);

  // Deploy main contract
  const MainContract = await hre.ethers.getContractFactory("MainContract");
  const mainContract = await hre.upgrades.deployProxy(MainContract, [ TABLELAND_CONTRACT ], {
    initializer: "initialize"
  })
  await mainContract.deployed();

  // Deploy NFT factory contract
  const FactoryNFTContract = await hre.ethers.getContractFactory("FactoryNFTContract");
  const factoryNFTContract = await hre.upgrades.deployProxy(FactoryNFTContract, [ mainContract.address, worldIDAddress ], {
    initializer: "initialize"
  })
  await factoryNFTContract.deployed();

  // Deploy FT factory contract
  const FactoryFTContract = await hre.ethers.getContractFactory("FactoryFTContract");
  const factoryFTContract = await hre.upgrades.deployProxy(FactoryFTContract, [ mainContract.address, worldIDAddress, SUPER_TOKEN_FACTORY ], {
    initializer: "initialize"
  })
  await factoryFTContract.deployed();

  // Update main contract - add factory address
  const MainContractInstance = await hre.ethers.getContractAt("MainContract", mainContract.address);
  await MainContractInstance.updateFactoryContractsAddress(factoryNFTContract.address, factoryFTContract.address);

  console.log("Main Contract: ", mainContract.address);
  console.log("Factory NFT Contract: ", factoryNFTContract.address);
  console.log("Factory FT Contract: ", factoryFTContract.address);

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
