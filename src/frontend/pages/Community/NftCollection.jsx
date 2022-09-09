import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card } from 'flowbite-react';
import { Btn, InnerBlock } from '../../assets/css/common.style';
import { useSigner } from 'wagmi';
import { convertFromEther, FormatNumber, isContractAddress } from '../../utils/format';
import { ethers } from 'ethers';
import { DeployNFTContract } from '../../components/Community/DeployNFTContract';
import { CreateNFTPopup } from '../../components/Community/CreateNFTPopup';
import { useOutletContext } from "react-router-dom";
import NFTCollectionABI from '../../contractsData/NFTCollection.json';

export const NftCollection = () => {
  const { data: signer } = useSigner();
  const currentCommunity = useSelector(state => state.community.current);
  const [reloadCommunityList] = useOutletContext();

  const [isReady, setIsReady] = useState(false);
  const [myNftContract, setMyNftContract] = useState();
  const [mintNFTPopupVisible, setMintNFTPopupVisible] = useState(false);
  const [myCollectionDetails, setMyCollectionDetails] = useState({
    name: "",
    symbol: "",
    supply: 0,
    itemsTotal: 0,
  });

  useEffect(() => {
    setIsReady(false);
    if (currentCommunity && currentCommunity.id) {
      // Init NFT Contract interface
      if (isContractAddress(currentCommunity.nftContract)) {
        loadMyNFTContract();
      }
      setIsReady(true);
    }
  }, [currentCommunity]);

  useEffect(() => {
    if (myNftContract) {
      loadMyCollectionDetails();
    }
  }, [myNftContract]);

  // Use default ethers contract to simplify data reads
  const loadMyNFTContract = () => {
    console.log('signer', signer)

    const contract = new ethers.Contract(
      currentCommunity.nftContract,
      NFTCollectionABI.abi,
      signer
    );
    setMyNftContract(contract);
  }

  const loadMyCollectionDetails = async () => {
    setMyCollectionDetails({
      name: await myNftContract.name(),
      symbol: await myNftContract.symbol(),
      supply: await myNftContract.totalSupply(),
      itemsTotal: await myNftContract.collectionItemsTotal(),
    })
  }

  const test = async () => {
    if (myNftContract) {
      console.log('myNftContract', myNftContract);
      const owner = await myNftContract.owner();
      const collection = await myNftContract.collectionItemsTotal();
      const name = await myNftContract.name();
      console.log('owner', owner);
      console.log('collection', parseInt(collection));
      console.log('name', name);
    }
  }

  return (
    <div className="flex flex-row">
      {isReady && (
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
                    <span className="opacity-80">Collection Name:</span> <b>{myCollectionDetails.name}</b>
                  </div>
                  <div>
                    <span className="opacity-80">Total Minted:</span>
                    <b className="ml-1">{FormatNumber(convertFromEther(myCollectionDetails.supply, 0))} NFT</b>
                  </div>
                </div>

                <hr className="mb-6" />
                <div className="flex justify-between text-sm mb-6">
                  <div>
                    Total: <b
                    className="ml-1">{FormatNumber(convertFromEther(myCollectionDetails.itemsTotal, 0))} NFT</b>
                  </div>
                  <div className="-mt-2">
                    <Button gradientDuoTone="purpleToPink" size="sm" onClick={() => setMintNFTPopupVisible(true)}>
                      + New NFT
                    </Button>
                  </div>
                </div>

                <div className="w-72 relative text-sm mb-6">
                  <span className="text-gray-700 absolute top-3 left-3 bg-white/80 px-3 py-1 rounded-md ">
                    Free
                  </span>
                  <Card imgSrc="https://flowbite.com/docs/images/blog/image-1.jpg">
                    <p className="text-center font-semibold">
                      <span>Minted: 0/9999 NFTs</span>
                    </p>
                  </Card>
                </div>

                <Btn onClick={() => test()}>test</Btn>

              </>
            ) : (
              <DeployNFTContract reloadCommunityList={reloadCommunityList} />
            )}
          </div>
        </InnerBlock>
      )}

      <CreateNFTPopup
        popupVisible={mintNFTPopupVisible}
        setPopupVisible={setMintNFTPopupVisible}
      />

    </div>
  );
}
