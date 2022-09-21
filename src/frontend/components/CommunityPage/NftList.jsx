import React, { useEffect } from "react";
import { useContractRead } from "wagmi";
import { isContractAddress } from "../../utils/format";
import { transformCollectionNFT } from "../../utils/transform";
import { InnerBlock } from "../../assets/css/common.style";
import NFTCollectionABI from "../../contractsData/NFTCollection.json";

export function NftList({ community }) {

  const { data: collectionNFT } = useContractRead({
    addressOrName: community?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: community && isContractAddress(community?.nftContract),
    functionName: "getCollections",
    select: data => data.filter(collection => collection.distribution).map(collection => transformCollectionNFT(collection))
  });

  useEffect(() => {
    console.log(`collectionNFT`, collectionNFT);
  }, [ collectionNFT ])

  useEffect(() => {
    console.log(`community && isContractAddress(community?.nftContract)`, community && isContractAddress(community?.nftContract));
    console.log(`community?.nftContract`, community?.nftContract);
  }, [ community?.nftContract ])

  return (
    <>
      {collectionNFT && collectionNFT.map(nft => (
        <div key={nft.id}>
          {nft.title}
        </div>
      ))}
    </>
  );
}
