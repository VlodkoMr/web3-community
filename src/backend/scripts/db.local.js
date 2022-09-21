const ethers = require("ethers");
const tbl = require("@tableland/sdk");

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
globalThis.fetch = fetch;

const privateKey = process.env.MUMBAI_TESTNET_PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey);

async function main() {
  const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_ID);
  const signer = wallet.connect(provider);
  const tableland = await tbl.connect({ signer, network: "testnet", chain: "polygon-mumbai" });

  console.log(`tableland`, tableland);

  const { name } = await tableland.create(
    `id INTEGER, wallet TEXT, email TEXT, created_at INTEGER, primary key (id)`,
    {
      prefix: `community_members`
    }
  );

  console.log(`name`, name);
  // web3_community_80001_2493

  const tables = await tableland.list();
  console.log(tables)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
