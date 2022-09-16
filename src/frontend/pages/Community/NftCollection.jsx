import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { useContractRead } from 'wagmi';
import { isContractAddress } from '../../utils/format';
import { DeployNFTContract } from '../../components/Community/DeployNFTContract';
import { CreateNFTPopup } from '../../components/Community/NftCollection/CreateNFTPopup';
import { useOutletContext } from "react-router-dom";
import NFTCollectionABI from '../../contractsData/NFTCollection.json';
import { transformCollectionNFT } from '../../utils/transform';
import { OneNFT } from '../../components/Community/NftCollection/OneNFT';
import { MintNFTPopup } from '../../components/Community/NftCollection/MintNFTPopup';

export const NftCollection = () => {
  const currentCommunity = useSelector(state => state.community.current);
  const [reloadCommunityList] = useOutletContext();
  const [createNFTPopupVisible, setCreateNFTPopupVisible] = useState(false);
  const [mintNFTPopupVisible, setMintNFTPopupVisible] = useState(false);
  const [mintNFTCollection, setMintNFTCollection] = useState();
  const [userCollections, setUserCollections] = useState([false]);

  const myNFTContract = {
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
  };

  const { data: collectionItems, refetch: refetchCollectionItems } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "getCollections",
  });
  const { data: totalCollections } = useContractRead({
    ...myNFTContract,
    functionName: "collectionsTotal",
    watch: true
  });
  const { data: tokenName } = useContractRead({
    ...myNFTContract,
    functionName: "name"
  });

  const pauseContract = () => {
    if (confirm("Paused contract don't allow minting or transfer NFT. Are you sure?")) {
      // pause
    }
  }

  const reloadCollectionItems = () => {
    refetchCollectionItems().then(result => {
      const transformedCollection = result.data.map(collection => transformCollectionNFT(collection));
      setUserCollections(transformedCollection);
    });
  }

  const handleMint = (nft) => {
    setMintNFTCollection(nft);
    setMintNFTPopupVisible(true);
  }

  useEffect(() => {
    if (collectionItems) {
      const transformedCollection = collectionItems.map(collection => transformCollectionNFT(collection));
      setUserCollections(transformedCollection);
    }
  }, [collectionItems])

  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>NFT Collection</span>
          {isContractAddress(currentCommunity.nftContract) && (
            <Button size="xsm" color="light" onClick={pauseContract}>
              <span className="text-sm px-2 font-medium text-red-500">Pause Contract</span>
            </Button>
          )}
        </InnerBlock.Header>
        <div>
          {isContractAddress(currentCommunity.nftContract) ? (
            <>
              <div className="flex justify-between text-sm mb-3 -mt-1">
                <div className="mr-10">
                  <span className="opacity-80">Collection Name:</span>
                  <b className="font-medium ml-1">{tokenName}</b>
                </div>
                <span className="text-sm font-normal text-slate-500">
                  <span className="font-medium mr-1">Contract:</span>
                  <small className="opacity-80">{currentCommunity.nftContract}</small>
                </span>
              </div>

              <hr className="mb-6" />
              <div className="flex justify-between text-sm mb-4">

                <div>
                  {(parseInt(totalCollections) === 0) ? (
                    <>*No NFT Series</>
                  ) : (
                    <div className="pt-1">
                      <span className="opacity-80">Total NFT Series:</span>
                      <b className="ml-1">{parseInt(totalCollections)} NFT</b>
                    </div>
                  )}
                </div>

                <div className="-mt-2 justify-end">
                  <Button gradientDuoTone="purpleToPink" size="sm" onClick={() => setCreateNFTPopupVisible(true)}>
                    Create NFT Series
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <DeployNFTContract reloadCommunityList={reloadCommunityList} />
          )}
        </div>
      </InnerTransparentBlock>

      {isContractAddress(currentCommunity.nftContract) && (
        <>
          {userCollections && userCollections.length > 0 && userCollections.map((nft, index) => (
            <OneNFT key={index} nft={nft} handleMint={() => handleMint(nft)} />
          ))}
        </>
      )}

      <CreateNFTPopup
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
    </div>
  );
}
