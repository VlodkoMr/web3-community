const hre = require("hardhat");
const { saveAllFrontendFiles, saveFrontendArtifact } = require('./utils');

const TABLELAND_CONTRACT = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

async function main() {
  // const [ deployer ] = await hre.ethers.getSigners();
  // console.log("Account balance:", (await deployer.getBalance()).toString());
  // const CanvasGame = await hre.ethers.getContractFactory("CanvasGame");
  // const canvasGame = await CanvasGame.deploy(TABLELAND_CONTRACT);
  //
  // console.log(`CanvasGame`, canvasGame.address);
  //
  // // const TestInstance = await hre.ethers.getContractAt("CanvasGame", canvasGame.address);
  // const x = await canvasGame.safeMint(deployer.address);
  // console.log(`x`, x);


  // Deploy main contract
  const MainContract = await hre.ethers.getContractFactory("MainContract");
  const mainContract = await hre.upgrades.deployProxy(MainContract, [], {
    initializer: "initialize"
  })
  await mainContract.deployed();

  // Deploy Members factory contract
  const FactoryMemberContract = await hre.ethers.getContractFactory("FactoryMemberContract");
  const factoryMemberContract = await hre.upgrades.deployProxy(FactoryMemberContract, [ mainContract.address, TABLELAND_CONTRACT ], {
    initializer: "initialize"
  })
  await factoryMemberContract.deployed();

  // Deploy NFT factory contract
  const FactoryNFTContract = await hre.ethers.getContractFactory("FactoryNFTContract");
  const factoryNFTContract = await hre.upgrades.deployProxy(FactoryNFTContract, [ mainContract.address ], {
    initializer: "initialize"
  })
  await factoryNFTContract.deployed();

  // Deploy FT factory contract
  const FactoryFTContract = await hre.ethers.getContractFactory("FactoryFTContract");
  const factoryFTContract = await hre.upgrades.deployProxy(FactoryFTContract, [ mainContract.address ], {
    initializer: "initialize"
  })
  await factoryFTContract.deployed();

  // Update main contract - add factory address
  const MainContractInstance = await hre.ethers.getContractAt("MainContract", mainContract.address);
  await MainContractInstance.updateFactoryContractsAddress(factoryNFTContract.address, factoryFTContract.address, membersContract.address);

  console.log("Main Contract: ", mainContract.address);
  console.log("Members Contract: ", factoryMemberContract.address);
  console.log("Factory NFT Contract: ", factoryNFTContract.address);
  console.log("Factory FT Contract: ", factoryFTContract.address);

  // Save ABI & Address
  saveAllFrontendFiles(mainContract, "MainContract");
  saveAllFrontendFiles(factoryNFTContract, "FactoryNFTContract");
  saveAllFrontendFiles(factoryFTContract, "FactoryFTContract");
  saveAllFrontendFiles(factoryMemberContract, "FactoryMemberContract");

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
