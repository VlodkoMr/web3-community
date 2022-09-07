import web3ContractAddress from '../contractsData/Web3Community-address.json';
import web3ContractABI from '../contractsData/Web3Community.json';
import { usePrepareContractWrite, useContractWrite } from 'wagmi';

const web3ContractBase = {
  addressOrName: web3ContractAddress.address,
  contractInterface: web3ContractABI.abi,
}

export function writeTx(functionName) {
  return usePrepareContractWrite({
    ...web3ContractBase,
    functionName,
  });

  // if (error) {
  //   alert(`Prepare error: ${error}`);
  //   return;
  // }
  //
  // return useContractWrite(config);
}
