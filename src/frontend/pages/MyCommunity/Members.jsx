import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import { useContractRead } from "wagmi";
import { isContractAddress } from "../../utils/format";
import { transformCollectionNFT } from "../../utils/transform";
import { Button, Option, Select } from "@material-tailwind/react";
import { communityTypes } from "../../utils/settings";

export const Members = () => {
  const currentCommunity = useSelector(state => state.community.current);
  const [ filterCollection, setFilterCollection ] = useState("");

  // useEffect(() => {
  //   console.log('currentCommunity', currentCommunity);
  // }, [ currentCommunity ]);

  const myNFTContract = {
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
  };

  const { data: collectionItems } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "getCollections",
    select: data => data.map(collection => transformCollectionNFT(collection))
  });


  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Members</span>
          <div className="w-64 -mt-3">
            <Select label="NFT Collection*"
                    value={filterCollection}
                    disabled={!!collectionItems}
                    onChange={val => setFilterCollection(val)}>
              {collectionItems.map((collection, index) => (
                <Option value={collection.id.toString()} key={index}>
                  {collection.title}
                </Option>
              ))}
            </Select>
          </div>
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          {filterCollection ? (
            <>
              show
            </>
          ) : (
            <div className={"text-gray-500"}>
              Please select NFT Collection to view all NFT holders.
            </div>
          )}
        </div>
      </InnerBlock>
    </div>
  );
}
