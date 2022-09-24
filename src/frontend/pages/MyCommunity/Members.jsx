import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import { useContractRead, useNetwork } from "wagmi";
import { isContractAddress } from "../../utils/format";
import { transformCollectionNFT } from "../../utils/transform";
import { Button, Option, Select } from "@material-tailwind/react";
import { communityTypes, getAlchemyURL } from "../../utils/settings";

export const Members = () => {
  const { chain } = useNetwork();
  const currentCommunity = useSelector(state => state.community.current);
  const [ filterCollection, setFilterCollection ] = useState("");
  const [ filterCollectionTitle, setFilterCollectionTitle ] = useState("");
  const [ nftOwners, setNftOwners ] = useState([]);

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

  const loadHoldersNFT = async () => {
    const chainURL = getAlchemyURL(chain.id);
    fetch(`${chainURL}/${process.env.ALCHEMY_API_KEY}/getOwnersForToken?contractAddress=${currentCommunity?.nftContract}&tokenId=${filterCollection}`)
      .then(result => result.json())
      .then((data) => {
        setNftOwners(data.owners);
      });
  }

  useEffect(() => {
    console.log(`collectionItems`, collectionItems);
  }, [ collectionItems ]);

  useEffect(() => {
    if (filterCollection) {
      collectionItems.map(item => {
        if (item.id.toString() === filterCollection) {
          setFilterCollectionTitle(item.title);
        }
      })

      loadHoldersNFT();
    }
  }, [ filterCollection ]);

  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Members</span>
          <div className="w-64 -mt-3">
            {collectionItems && (
              <Select label="NFT Collection*"
                      value={filterCollection}
                      className={"bg-white"}
                      disabled={!collectionItems}
                      onChange={val => setFilterCollection(val)}>
                {collectionItems.map((collection, index) => (
                  <Option value={collection.id.toString()} key={index}>
                    {collection.title}
                  </Option>
                ))}
              </Select>
            )}
          </div>
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          {nftOwners && nftOwners.length > 0 ? (
            <div className={"text-sm"}>
              <b className={"block mb-4"}>NFT Holders for collection "{filterCollectionTitle}":</b>
              {nftOwners.map(address => (
                <div key={address}>
                  <span>{address}</span>
                  <span className={"opacity-0"}>,</span>
                </div>
              ))}
            </div>
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
