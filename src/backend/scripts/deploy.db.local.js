// Require `connect` from Tableland plus wallet requirements from `ethers`
const ethers = require("ethers");
const tbl = require("@tableland/sdk");

// Since Metamask is not accessible via browser injection,
// it is required to supply a private key.
// Do not expose this key directly but load from a `.env` file
const privateKey = "PRIVATE_KEY_STRING";
const wallet = new ethers.Wallet(privateKey);

// An RPC provider must be provided to establish a connection to the chain
const provider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_ID);
// By default, `connect` uses the Tableland testnet validator;
// it will sign a message using the associated wallet
const signer = wallet.connect(provider);
const tableland = await tbl.connect({ signer, network: "testnet", chain: "polygon-mumbai" });

console.log(`tableland`, tableland);

const { name } = await tableland.create(
  `id integer, name text, primary key (id)`, // Table schema definition
  {
    prefix: `my_sdk_table` // Optional `prefix` used to define a human-readable string
  }
);


const tables = await tableland.list();
console.log(tables)

// Create a new table with a supplied SQL schema and optional `prefix`
// (Same logic as the client code in the section above)