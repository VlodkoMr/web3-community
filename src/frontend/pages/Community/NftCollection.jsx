import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';
import { InnerBlock } from '../../assets/css/common.style';
import { useSigner } from 'wagmi';
import { isContractAddress } from '../../utils/format';
import { ethers } from 'ethers';
import NFTCollectionABI from '../../contractsData/NFTCollection.json';
import { DeployNFTContract } from '../../components/Community/DeployNFTContract';

export const NftCollection = ({ contract }) => {
  const { data: signer } = useSigner();
  const [isReady, setIsReady] = useState(false);
  const [myNftContract, setMyNftContract] = useState();
  const currentCommunity = useSelector(state => state.community.current);

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

  const loadMyNFTContract = () => {
    const contract = new ethers.Contract(
      currentCommunity.nftContract,
      NFTCollectionABI.abi,
      signer
    );
    setMyNftContract(contract);
  }


  const test = async () => {
    if (myNftContract) {
      console.log('myNftContract', myNftContract);
      const owner = await myNftContract.owner();
      console.log('owner', owner);
    }
  }

  return (
    <div className="flex flex-row">
      {isReady && (
        <InnerBlock>
          <InnerBlock.Header className="flex justify-between">
            <span>NFT Collection</span>
            {isContractAddress(currentCommunity.nftContract) && (
              <span className="text-sm bg-gray-50 rounded px-3 py-1 font-medium">
                Contract: <small>{currentCommunity.nftContract}</small>
              </span>
            )}
          </InnerBlock.Header>
          <div>
            {isContractAddress(currentCommunity.nftContract) ? (
              <>
                ...

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
