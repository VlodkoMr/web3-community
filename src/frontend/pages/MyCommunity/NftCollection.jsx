import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { useContractRead } from 'wagmi';
import { Button } from '@material-tailwind/react';
import { useOutletContext } from "react-router-dom";
import { isContractAddress } from '../../utils/format';
import { DeployNFTContract } from '../../components/MyCommunity/NftCollection/DeployNFTContract';
import { CreateNFTSeriesPopup } from '../../components/MyCommunity/NftCollection/CreateNFTSeriesPopup';
import { transformCollectionNFT } from '../../utils/transform';
import { OneNFTSeries } from '../../components/MyCommunity/NftCollection/OneNFTSeries';
import { MintNFTPopup } from '../../components/MyCommunity/NftCollection/MintNFTPopup';
import { DistributionCampaignNFTPopup } from '../../components/MyCommunity/NftCollection/DistributionCampaignNFTPopup';
import { PauseUnpausePopup } from '../../components/MyCommunity/PauseUnpausePopup';
import NFTCollectionABI from '../../contractsData/NFTCollection.json';

export const NftCollection = () => {
  const currentCommunity = useSelector(state => state.community.current);
  const [ reloadCommunityList ] = useOutletContext();
  const [ createNFTPopupVisible, setCreateNFTPopupVisible ] = useState(false);

  const [ mintNFTCollection, setMintNFTCollection ] = useState();
  const [ mintNFTPopupVisible, setMintNFTPopupVisible ] = useState(false);
  const [ createCampaign, setCreateCampaign ] = useState();
  const [ campaignPopupVisible, setCampaignPopupVisible ] = useState(false);

  const myNFTContract = {
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
  };

  const { data: collectionItems, refetch: refetchCollectionItems } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "getCollections",
    select: data => data.map(collection => transformCollectionNFT(collection))
  });
  const { data: totalCollections, refetch: refetchTotalCollections } = useContractRead({
    ...myNFTContract,
    functionName: "collectionsTotal",
  });
  const { data: tokenName } = useContractRead({
    ...myNFTContract,
    functionName: "name"
  });

  const reloadCollectionItems = () => {
    refetchCollectionItems();
    refetchTotalCollections();
  }

  const handleMint = (nft) => {
    setMintNFTCollection(nft);
    setMintNFTPopupVisible(true);
  }
  const handleCreateCampaign = (nft) => {
    setCreateCampaign(nft);
    setCampaignPopupVisible(true);
  }

  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>NFT Collection</span>
          {isContractAddress(currentCommunity?.nftContract) && (
            <PauseUnpausePopup contractAddress={currentCommunity.nftContract}
                               contractABI={NFTCollectionABI}
                               handleSuccess={reloadCommunityList}
            />
          )}
        </InnerBlock.Header>
        <div>
          {isContractAddress(currentCommunity.nftContract) ? (
            <>
              <div className="flex justify-between text-sm mb-3 -mt-1">
                <div className="mr-10">
                  <span>Collection Name:</span>
                  <b className="font-medium ml-1">{tokenName}</b>
                </div>
                <span className="text-sm font-normal text-slate-500">
                  <span className="font-medium mr-1">Contract:</span>
                  <small className="opacity-80">{currentCommunity.nftContract}</small>
                </span>
              </div>

              <hr className="mb-6"/>
              <div className="flex justify-between text-sm mb-4">
                <div>
                  {(parseInt(totalCollections || "0") === 0) ? (
                    <>*No NFT Series</>
                  ) : (
                    <div className="pt-1">
                      <span className="opacity-80">Total Series:</span>
                      <b className="ml-1">{parseInt(totalCollections)} NFT</b>
                    </div>
                  )}
                </div>

                <div className="-mt-3 justify-end">
                  <Button onClick={() => setCreateNFTPopupVisible(true)}>
                    Create NFT Series
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <DeployNFTContract reloadCommunityList={reloadCommunityList}/>
          )}
        </div>
      </InnerTransparentBlock>

      {isContractAddress(currentCommunity.nftContract) && (
        <>
          {collectionItems && collectionItems.length > 0 && collectionItems.map((nft, index) => (
            <OneNFTSeries
              key={index}
              currentCommunity={currentCommunity}
              nft={nft}
              handleMint={() => handleMint(nft)}
              handleCreateCampaign={() => handleCreateCampaign(nft)}
              handleReloadCampaigns={() => refetchCollectionItems()}
            />
          ))}
        </>
      )}

      <CreateNFTSeriesPopup
        popupVisible={createNFTPopupVisible}
        setPopupVisible={setCreateNFTPopupVisible}
        handleSuccess={() => reloadCollectionItems()}
      />

      <MintNFTPopup
        popupVisible={mintNFTPopupVisible}
        setPopupVisible={setMintNFTPopupVisible}
        collection={mintNFTCollection}
        currentCommunity={currentCommunity}
        handleSuccess={() => refetchCollectionItems()}
      />

      <DistributionCampaignNFTPopup
        popupVisible={campaignPopupVisible}
        setPopupVisible={setCampaignPopupVisible}
        collection={createCampaign}
        currentCommunity={currentCommunity}
        handleSuccess={() => refetchCollectionItems()}
      />
    </div>
  );
}
