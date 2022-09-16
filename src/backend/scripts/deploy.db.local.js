const hre = require("hardhat");
import { Wallet, providers } from "ethers";
import { connect } from "@tableland/sdk";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const tableland = await connect({ network: "testnet", chain: "local-tableland" });


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
