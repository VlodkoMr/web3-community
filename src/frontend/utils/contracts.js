import mainContractAddress from '../contractsData/MainContract-address.json';
import mainContractABI from '../contractsData/MainContract.json';
import factoryNFTContractAddress from '../contractsData/FactoryNFTContract-address.json';
import factoryNFTContractABI from '../contractsData/FactoryNFTContract.json';
import factoryFTContractAddress from '../contractsData/FactoryFTContract-address.json';
import factoryFTContractABI from '../contractsData/FactoryFTContract.json';

export const mainContract = {
  addressOrName: mainContractAddress.address,
  contractInterface: mainContractABI.abi,
}

export const factoryNFTContract = {
  addressOrName: factoryNFTContractAddress.address,
  contractInterface: factoryNFTContractABI.abi,
}

export const factoryFTContract = {
  addressOrName: factoryFTContractAddress.address,
  contractInterface: factoryFTContractABI.abi,
}
