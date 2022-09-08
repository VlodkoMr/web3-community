import { transformCommunity } from './transform';
import { setCommunityList, setCurrentCommunity } from '../store/communitySlice';

export const loadCommunityList = async (contract, dispatch, address, setLastByDefault = false) => {
  return new Promise(async (resolve) => {
    const myCommunity = await contract.getUserCommunities(address);
    if (myCommunity.length) {
      if (setLastByDefault) {
        const lastCommunity = myCommunity[myCommunity.length - 1];
        localStorage.setItem("communityId", parseInt(lastCommunity.id));
      }
      let selectedCommunity = parseInt(localStorage.getItem("communityId"));
      if (!selectedCommunity) {
        selectedCommunity = parseInt(myCommunity[0].id);
      }

      const transformedCommunity = myCommunity.map(item => {
        const community = transformCommunity(item);
        if (community.id === selectedCommunity) {
          // select active community
          dispatch(setCurrentCommunity({ community }));
        }
        return community;
      });
      dispatch(setCommunityList({ list: transformedCommunity }));
    }

    resolve();
  })
}
