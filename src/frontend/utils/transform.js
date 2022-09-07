export const transformCommunity = (item) => {
  return {
    id: parseInt(item.id),
    name: item.name,
    logo: item.logo,
    nftContract: item.nftContract,
    ftContract: item.ftContract,
  }
};
