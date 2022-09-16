import mainContractAddress from '../contractsData/MainContract-address.json';
import mainContractABI from '../contractsData/MainContract.json';
import factoryContractAddress from '../contractsData/FactoryContract-address.json';
import factoryContractABI from '../contractsData/FactoryContract.json';

export const mainContract = {
  addressOrName: mainContractAddress.address,
  contractInterface: mainContractABI.abi,
}

export const factoryContract = {
  addressOrName: factoryContractAddress.address,
  contractInterface: factoryContractABI.abi,
}
