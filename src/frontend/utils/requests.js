import nftContractAddress from '../contractsData/RestoreTogetherNFT-address.json';
import ERC20ContractAbi from '@openzeppelin/contracts/build/contracts/ERC20.json';
import { BigNumber, ethers } from 'ethers';
import { convertToWei } from './format';

console.log('Contract Address', nftContractAddress.address);

export const loadTokensBalancePromise = async (library, account, tokensList) => {
  return new Promise(async (resolve) => {
    const tokens = await window.web3API.alchemy.getTokenBalances(account, tokensList);
    resolve(tokens.tokenBalances);
  });
}

export const loadNativeBalancePromise = async (library, account) => {
  return new Promise(async (resolve) => {
    library.getBalance(account, 'latest').then(i => {
      resolve(BigNumber.from(i));
    });
  });
}

export const loadTokenPricePromise = (tokenSymbol) => {
  return new Promise(async (resolve) => {
    await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${tokenSymbol}USDT`)
      .then(response => response.json())
      .then(data => {
        resolve(convertToWei(data.price).toString());
      });
  });
};

export const loadVariablePromise = (contract, variable) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await contract[variable]();
      resolve(result.toString());
    } catch (e) {
      console.log(`Error load variable ${variable}`, e)
      reject();
    }
  });
}

export const loadNFTs = (ownerAddress) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (ownerAddress) {
        const nftList = await window.web3API.alchemy.getNfts({
          owner: ownerAddress,
          contractAddresses: [nftContractAddress.address]
        });
        resolve(nftList.ownedNfts);
      } else {
        const baseURL = `${process.env.ALCHEMY_API_URL}/getNFTsForCollection`;
        const fetchURL = `${baseURL}?contractAddress=${nftContractAddress.address}&withMetadata=true&tokenUriTimeoutInMs=5000`;
        let requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        const nftList = await fetch(fetchURL, requestOptions)
          .then(response => response.json())
          .catch(error => console.log('error', error));
        resolve(nftList.nfts);
      }
    } catch (e) {
      console.log('Error load loadNFTs', e)
      reject();
    }
  });
}

export const processNativePayment = async (contract, isRare, amountWei) => {
  const gas = await contract.estimateGas.mint(isRare, { value: amountWei });
  return await contract.mint(isRare, {
    value: amountWei,
    gasLimit: parseInt(gas * 1.2)
  });
}

export const needTokenAllowance = async (amountWei, ownerAddress, currencyAddress) => {
  const allowance = await window.web3API.alchemy.getTokenAllowance({
    contract: currencyAddress,
    owner: ownerAddress,
    spender: nftContractAddress.address
  });
  return BigNumber.from(allowance).lt(BigNumber.from(amountWei));
}

export const allowTokenSpend = async (library, account, amountWei, currencyAddress) => {
  const signer = library.getSigner();
  const tokenContract = new ethers.Contract(
    currencyAddress,
    ERC20ContractAbi.abi,
    signer
  );
  const gas = await tokenContract.estimateGas.approve(nftContractAddress.address, amountWei);
  return await tokenContract.approve(nftContractAddress.address, amountWei, {
    gasLimit: parseInt(gas * 1.2)
  });
}

export const processTokenPayment = async (contract, isRare, amountWei, currencyId) => {
  const gas = await contract.estimateGas.mintByERC20(currencyId, isRare, amountWei);
  return await contract.mintByERC20(currencyId, isRare, amountWei, {
    gasLimit: parseInt(gas * 1.2)
  });
}

// ------------------

export const loadCurrencyList = (contract) => {
  return new Promise(async (resolve, reject) => {
    let currencyList = await contract.getCurrencies();
    resolve(currencyList);
  });
}

export const loadDonatesInfo = (contract, idList) => {
  return new Promise(async resolve => {
    const donates = await contract.donatesInfo(idList);
    resolve(donates);
  });
}

export const loadResultsInfo = (contract, idList) => {
  return new Promise(async resolve => {
    const reports = await contract.reportsInfo(idList);
    resolve(reports);
  });
}
