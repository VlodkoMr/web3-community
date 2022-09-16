import { isContractAddress, MediaURL } from './format';

export const transformCommunity = (item) => {
  return {
    id: parseInt(item.id),
    name: item.name,
    logo: item.logo,
    category: parseInt(item.category),
    privacy: parseInt(item.privacy),
    nftContract: item.nftContract,
    ftContract: item.ftContract,
    description: item.description,
  }
};

export const transformCollectionNFT = (item) => {
  let royalty = null;
  if (isContractAddress(item.royalty.account)) {
    royalty = {
      address: item.royalty.account,
      percent: parseInt(item.royalty.percent)
    };
  }

  return {
    id: parseInt(item.id),
    title: item.title,
    price: parseInt(item.price),
    mintedTotal: parseInt(item.mintedTotal),
    supply: parseInt(item.supply),
    jsonUri: item.jsonUri,
    mediaUri: MediaURL(item.mediaUri),
    royalty
  }
};
