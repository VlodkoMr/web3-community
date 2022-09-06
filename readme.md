# Web3 Community

Best service to create your own web3 community.

## Getting Started

These instructions will get you a copy of the project up and running on your Mumbai testnet for development and testing purposes.

### Prerequisites

```
nodeJS >= 16.0
npm
```

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
yarn deploy
yarn start
```

## Production

```
yarn deploy:polygon
yarn build:polygon
```

- Update CONTRACT_PROXY in src/backend/scripts/update.polygon.js
- Deploy frontend or use Spheron network for CI/CD
- Fill environment variables: .env.mainnet.polygon

### Verify Smart Contract

```
yarn verify:polygon
```

### Update Smart Contract

```
yarn update:polygon
```
