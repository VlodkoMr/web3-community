import { transformCommunity } from './transform';
import { setCommunityList, setCurrentCommunity } from '../store/communitySlice';
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

// export const loadCommunityList = async (dispatch, communityList, setLastByDefault = false) => {
//   return new Promise(async (resolve) => {
//     if (communityList.length) {
//       if (setLastByDefault) {
//         const lastCommunity = communityList[communityList.length - 1];
//         localStorage.setItem("communityId", lastCommunity.id);
//       }
//       let selectedCommunity = parseInt(localStorage.getItem("communityId"));
//       if (!selectedCommunity) {
//         selectedCommunity = parseInt(communityList[0].id);
//       }
//
//       const transformedCommunity = communityList.map(item => {
//         const community = transformCommunity(item);
//         if (community.id === selectedCommunity) {
//           // select active community
//           dispatch(setCurrentCommunity({ community }));
//         }
//         return community;
//       });
//       dispatch(setCommunityList({ list: transformedCommunity }));
//     }
//
//     resolve();
//   })
// }
