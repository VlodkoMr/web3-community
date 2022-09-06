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

  let nonce = await deployer.getTransactionCount();
  console.log('Wallet Nonce', nonce);

  const RestoreTogetherContract = await hre.ethers.getContractAt("RestoreTogetherNFT", restoreTogetherNFT.address);
  RestoreTogetherContract.addCurrency(nativeTokenSymbol, emptyAddress, false, 18, "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0", {
    nonce: ++nonce
  });
  RestoreTogetherContract.addCurrency("BTC", "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", false, 8, "0xc907E116054Ad103354f2D350FD2514433D57F6f", {
    nonce: ++nonce
  });
  RestoreTogetherContract.addCurrency("USDT", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", true, 6, emptyAddress, {
    nonce: ++nonce
  });
  RestoreTogetherContract.addCurrency("USDC", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", true, 6, emptyAddress, {
    nonce: ++nonce
  });
  RestoreTogetherContract.addCurrency("DAI", "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", true, 18, emptyAddress, {
    nonce: ++nonce
  });

  console.log("Added currencies");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
