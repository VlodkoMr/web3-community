import { InjectedConnector } from '@web3-react/injected-connector';
import { BigNumber } from 'ethers';

export const isMetamaskInstalled = () => {
  return typeof window.ethereum !== "undefined";
};

export const checkNetwork = async (chainId) => {
  if (!chainId) {
    chainId = await window.ethereum.request({ method: 'eth_chainId' });
    chainId = BigNumber.from(chainId).toNumber();
  }
  return chainId === BigNumber.from(process.env.CHAIN_ID).toNumber();
}

export const connectWeb3Wallets = async (activate, chainId) => {
  try {
    const injected = new InjectedConnector({
      supportedChainIds: [BigNumber.from(process.env.CHAIN_ID).toNumber()]
    });
    await activate(injected);
  } catch (e) {
    console.log('Connection Error!', e)
  }

  if (!chainId) {
    switchNetworkToCorrect();
  }
}

export const switchNetworkToCorrect = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: process.env.CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: process.env.CHAIN_ID,
            chainName: process.env.CHAIN_NAME,
            rpcUrls: process.env.CHAIN_RPC_URL.split(','),
            blockExplorerUrls: [process.env.EXPLORER_URL],
            nativeCurrency: {
              symbol: process.env.TOKEN_SYMBOL,
              decimals: parseInt(process.env.TOKEN_DECIMALS)
            }
          }]
      });
    }
  }
}
