# Web3 Community

Best service to create your own web3 community.

## Getting Started

These instructions will get you a copy of the project up and running on your Mumbai testnet for development and testing purposes.

### Prerequisites

```
nodeJS >= 16.0
npm
evm-tableland
```

### Local usage:

1. Run hardhat local server
2. Deploy tableland contract (use evm-tableland):

``` 
npx hardhat run scripts/deploy.ts --network localhost
```

3. Update TABLELAND_CONTRACT in deploy.local.js (set proxy address).
4. Deploy smart-contracts
5. Run frontend

### Installing

Install dependencies and create environment file:

```
npm install
cp .env-sample .env
```

Fill environment variables in files:

- .env
- .env.localhost

### Build & Deploy

```
npm run deploy
npm run start
```

## Production

```
npm run deploy:polygon
npm run build:polygon
```

- Update CONTRACT_PROXY in src/backend/scripts/update.polygon.js
- Fill environment variables for your chain
- Build frontend & deploy

### Verify Smart Contract

```
npm run verify:polygon
```

### Update Smart Contract

```
npm run update:polygon
```
