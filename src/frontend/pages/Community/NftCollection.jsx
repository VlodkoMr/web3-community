import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card } from 'flowbite-react';
import { InnerBlock } from '../../assets/css/common.style';
import { useContractRead } from 'wagmi';
import { isContractAddress } from '../../utils/format';
import { DeployNFTContract } from '../../components/Community/DeployNFTContract';
import { CreateNFTPopup } from '../../components/Community/CreateNFTPopup';
import { useOutletContext } from "react-router-dom";
import NFTCollectionABI from '../../contractsData/NFTCollection.json';

export const NftCollection = () => {
  const currentCommunity = useSelector(state => state.community.current);
  const [reloadCommunityList] = useOutletContext();
  const [mintNFTPopupVisible, setMintNFTPopupVisible] = useState(false);

  const myNFTContract = {
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
  };

  const { data: collectionItems, refetch: refetchCollectionItems } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "getCollectionItems",
  });

  const { data: collectionsTotal } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "collectionsTotal",
  });
  const { data: totalNFT } = useContractRead({
    ...myNFTContract,
    functionName: "collectionItemsTotal",
  });
  const { data: tokenName } = useContractRead({
    ...myNFTContract,
    functionName: "name",
  });

  const reloadCollectionItems = () => {
    refetchCollectionItems().then(result => {
      console.log('refetch result', result);
      // loadCommunityList(result.data, setLastByDefault);
    });
  }

  useEffect(() => {
    console.log('collectionItems', collectionItems);
  }, [collectionItems])

  useEffect(() => {
    console.log('myNFTContract', myNFTContract);
  }, [])

  return (
    <div className="flex flex-row">
      <InnerBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>NFT Collection</span>
          {isContractAddress(currentCommunity.nftContract) && (
            <span className="text-sm bg-gray-50 rounded px-3 py-1 font-normal text-slate-500">
                <span className="font-semibold mr-1">Contract:</span>
                <small className="opacity-80">{currentCommunity.nftContract}</small>
              </span>
          )}
        </InnerBlock.Header>
        <div>
          {isContractAddress(currentCommunity.nftContract) ? (
            <>
              <div className="flex justify-between text-sm mb-3 -mt-1">
                <div className="mr-10">
                  <span className="opacity-80">Collection Name:</span> <b>{tokenName}</b>
                </div>
                <div>
                  <span className="opacity-80">Total:</span>
                  <b className="ml-1">{parseInt(collectionsTotal)} NFT</b>
                </div>
              </div>

              <hr className="mb-6" />
              <div className="flex justify-between text-sm mb-6">
                {/*<div>*/}
                {/*  Unique items: <b*/}
                {/*  className="ml-1">{parseInt(totalNFT)} NFT</b>*/}
                {/*</div>*/}
                <div className="-mt-2 justify-end">
                  <Button gradientDuoTone="purpleToPink" size="sm" onClick={() => setMintNFTPopupVisible(true)}>
                    + New NFT
                  </Button>
                </div>
              </div>

              {collectionItems && collectionItems.length > 0 ? (
                <>
                  {collectionItems.map(nft => (
                    <div className="w-72 relative text-sm mb-6">
                  <span className="text-gray-700 absolute top-3 left-3 bg-white/80 px-3 py-1 rounded-md ">
                    Free
                  </span>
                      <Card imgSrc="https://flowbite.com/docs/images/blog/image-1.jpg">
                        <p className="text-center font-semibold">
                          <span>Minted: 0/9999 NFTs</span>
                          {nft.uri}
                        </p>
                      </Card>
                    </div>
                  ))}
                </>
              ) : (
                <small>
                  *No NFTs. You can <span className="underline cursor-pointer" onClick={() => setMintNFTPopupVisible(true)}>add new NFT</span>.
                </small>
              )}
            </>
          ) : (
            <DeployNFTContract reloadCommunityList={reloadCommunityList} />
          )}
        </div>
      </InnerBlock>

      <CreateNFTPopup
        popupVisible={mintNFTPopupVisible}
        setPopupVisible={setMintNFTPopupVisible}
        handleSuccess={() => reloadCollectionItems()}
      />

    </div>
  );
}
