import { formatPrice, isContractAddress, mediaURL } from './format';

export const transformCommunity = (item) => {
  return {
    id: item.id.toString(),
    name: item.name,
    logo: item.logo,
    category: item.category.toString(),
    privacy: item.privacy.toString(),
    nftContract: item.nftContract,
    ftContract: item.ftContract,
    description: item.description,
    membersTable: item.membersTable,
    memberStatsTable: item.memberStatsTable,
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

  let distribution = null;
  if (item.distribution.distType > 0) {
    distribution = {
      distType: item.distribution.distType,
      dateStart: parseInt(item.distribution.dateStart),
      dateEnd: parseInt(item.distribution.dateEnd),
      eventCode: parseInt(item.distribution.eventCode),
      whitelist: item.distribution.whitelist,
      worldcoinAction: item.distribution.worldcoinAction
    }
  }

  return {
    id: parseInt(item.id),
    title: item.title,
    price: formatPrice(item.price),
    mintedTotal: parseInt(item.mintedTotal),
    supply: parseInt(item.supply),
    jsonUri: item.jsonUri,
    mediaUri: mediaURL(item.mediaUri),
    royalty,
    distribution
  }
};

export const transformFTCampaign = (item) => {
  return {
    id: parseInt(item.id),
    distType: item.distType,
    dateStart: parseInt(item.dateStart),
    dateEnd: parseInt(item.dateEnd),
    eventCode: parseInt(item.eventCode),
    whitelist: item.whitelist,
    tokensTotal: item.tokensTotal,
    tokensMinted: item.tokensMinted,
    tokensPerUser: item.tokensPerUser,
    worldcoinAction: item.worldcoinAction
  }
};
