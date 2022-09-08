import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';
import { InnerBlock } from '../../assets/css/common.style';
import { useAccount, useSigner } from 'wagmi';
import { convertFromEther, FormatNumber, isContractAddress } from '../../utils/format';
import { ethers } from 'ethers';
import NFTCollectionABI from '../../contractsData/NFTCollection.json';
import { DeployNFTContract } from '../../components/Community/DeployNFTContract';

export const NftCollection = ({ contract }) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [isReady, setIsReady] = useState(false);
  const [myNftContract, setMyNftContract] = useState();
  const currentCommunity = useSelector(state => state.community.current);
  const [myCollectionDetails, setMyCollectionDetails] = useState({
    name: "",
    symbol: "",
    supply: 0,
    balance: 0,
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

  const loadMyNFTContract = () => {
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
      balance: await myNftContract.balanceOf(address),
    })
  }

  const test = async () => {
    if (myNftContract) {
      console.log('myNftContract', myNftContract);
      const owner = await myNftContract.owner();
      const collection = await myNftContract.collectionItemsTotal();
      console.log('owner', owner);
      console.log('collection', parseInt(collection));
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
                    <span className="opacity-80">Total Items:</span>
                    <b className="ml-1">{FormatNumber(convertFromEther(myCollectionDetails.itemsTotal, 0))} NFTs</b>
                  </div>
                </div>

                <hr className="mb-6" />
                <div className="flex text-sm mb-6">
                  Wallet Balance: <b className="ml-1">{FormatNumber(convertFromEther(myCollectionDetails.balance, 0))} NFTs</b>
                </div>

                <Button onClick={() => test()}>Test</Button>

              </>
            ) : (
              <DeployNFTContract contract={contract} />
            )}
          </div>
        </InnerBlock>
      )}
    </div>
  );
}
