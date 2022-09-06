exports.saveFrontendFiles = (contract, name, networkDir) => {
  const fs = require("fs");
  const contractsDir = `${__dirname}/../../frontend/contractsData/${networkDir || ""}`;

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );

  if (!networkDir) {
    this.saveFrontendFiles(contract, name, process.env.HARDHAT_NETWORK);
  }
}