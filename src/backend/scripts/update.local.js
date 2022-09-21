const hre = require("hardhat");
const { saveFrontendFiles } = require('./utils');

const MAIN_CONTRACT_PROXY = "0x07E2800b56AF206340Ae1EE1714a119Df25ebc23";
const MEMBER_CONTRACT_PROXY = "0x33A118c1b074eDd6c1c23C63f9f3F460a3a4a9A3";
const NFT_FACTORY_CONTRACT_PROXY = "0x8acd0F2f769Ae82F997AFDF59954BA633D0Ab67c";
const FT_FACTORY_CONTRACT_PROXY = "0xCFF245fad71954fB62fa8c82FDA2CA9527E99240";

async function main() {
  const [ deployer ] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const MainContract = await hre.ethers.getContractFactory("MainContract");
  const mainContract = await hre.upgrades.upgradeProxy(MAIN_CONTRACT_PROXY, MainContract);

  const MembersContract = await hre.ethers.getContractFactory("MembersContract");
  const membersContract = await hre.upgrades.upgradeProxy(MEMBER_CONTRACT_PROXY, MembersContract);

  const FactoryNFTContract = await hre.ethers.getContractFactory("FactoryNFTContract");
  const factoryNFTContract = await hre.upgrades.upgradeProxy(NFT_FACTORY_CONTRACT_PROXY, FactoryNFTContract);

  const FactoryFTContract = await hre.ethers.getContractFactory("FactoryFTContract");
  const factoryFTContract = await hre.upgrades.upgradeProxy(FT_FACTORY_CONTRACT_PROXY, FactoryFTContract);

  console.log('Contract upgraded');

  saveFrontendFiles(mainContract, "MainContract");
  saveFrontendFiles(membersContract, "MembersContract");
  saveFrontendFiles(factoryNFTContract, "FactoryNFTContract");
  saveFrontendFiles(factoryFTContract, "FactoryFTContract");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
