const fs = require("fs");

// Generate contract Address & Artifacts
exports.saveAllFrontendFiles = (contract, name, networkDir) => {
  const contractsDir = `${__dirname}/../../frontend/contractsData/${networkDir || ""}`;
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  if (!networkDir) {
    this.saveAllFrontendFiles(contract, name, process.env.HARDHAT_NETWORK);
    this.saveFrontendArtifact(name, networkDir);
  }
}

// Generate contract Artifact
exports.saveFrontendArtifact = (name, networkDir) => {
  const contractsDir = `${__dirname}/../../frontend/contractsData/${networkDir || ""}`;
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  const contractArtifact = artifacts.readArtifactSync(name);
  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );

  if (!networkDir) {
    this.saveFrontendArtifact(name, process.env.HARDHAT_NETWORK);
  }
}
