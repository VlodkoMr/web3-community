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
