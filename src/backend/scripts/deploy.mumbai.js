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

  const nativeTokenSymbol = "MATIC";
  const emptyAddress = "0x0000000000000000000000000000000000000000";

  const RestoreTogetherNFT = await hre.ethers.getContractFactory("RestoreTogetherNFT");
  const restoreTogetherNFT = await hre.upgrades.deployProxy(RestoreTogetherNFT, [], {
    initializer: "initialize"
  })
  await restoreTogetherNFT.deployed();

  // const RestoreTogetherNFT = await hre.ethers.getContractFactory("RestoreTogetherNFT");
  // const restoreTogetherNFT = await RestoreTogetherNFT.deploy();
  // await restoreTogetherNFT.deployed();

  console.log("Deployed to: ", restoreTogetherNFT.address);
  saveFrontendFiles(restoreTogetherNFT, "RestoreTogetherNFT");

  // let nonce = await deployer.getTransactionCount();
  // console.log('Wallet Nonce', nonce);

  const RestoreTogetherContract = await hre.ethers.getContractAt("RestoreTogetherNFT", restoreTogetherNFT.address);
  await RestoreTogetherContract.addCurrency(nativeTokenSymbol, emptyAddress, false, 18, "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada");
  await RestoreTogetherContract.addCurrency("ETH", "0xe680fa3cf20caab259ab3e2d55a29c942ad72d01", false, 18, "0x0715A7794a1dc8e42615F059dD6e406A6594651A");
  await RestoreTogetherContract.addCurrency("USDT", "0xf7f730ffaec85455e3ba44f488c2bd2a741953b3", true, 6, emptyAddress);
  await RestoreTogetherContract.addCurrency("USDC", "0xe11A86849d99F524cAC3E7A0Ec1241828e332C62", true, 6, emptyAddress);
  await RestoreTogetherContract.addCurrency("DAI", "0xe680fa3cf20caab259ab3e2d55a29c942ad72d01", true, 18, emptyAddress);

  console.log("Added currencies");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
