import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';
import { InnerBlock } from '../../assets/css/common.style';
import { useSigner } from 'wagmi';
import { isContractAddress } from '../../utils/format';
import { ethers } from 'ethers';
import FungibleTokenABI from '../../contractsData/FungibleToken.json';
import { DeployFTContract } from '../../components/Community/DeployFTContract';

export const FungibleToken = ({ contract }) => {
  const { data: signer } = useSigner();
  const [isReady, setIsReady] = useState(false);
  const [myFTContract, setMyFTContract] = useState();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    setIsReady(false);
    if (currentCommunity && currentCommunity.id) {
      // Init NFT Contract interface
      if (isContractAddress(currentCommunity.ftContract)) {
        loadMyFTContract();
      }
      setIsReady(true);
    }
  }, [currentCommunity]);

  const loadMyFTContract = () => {
    const contract = new ethers.Contract(
      currentCommunity.ftContract,
      FungibleTokenABI.abi,
      signer
    );
    setMyFTContract(contract);
  }

  const test = async () => {
    if (myFTContract) {
      console.log('myFTContract', myFTContract);
      const owner = await myFTContract.owner();
      const totalSupply = await myFTContract.totalSupply();
      console.log('owner', owner);
      console.log('totalSupply', parseInt(totalSupply));
    }
  }

  return (
    <div className="flex flex-row">
      {isReady && (
        <InnerBlock>
          <InnerBlock.Header className="flex justify-between">
            <span>Fungible Token</span>
            {isContractAddress(currentCommunity.ftContract) && (
              <span className="text-sm bg-gray-50 rounded px-3 py-1 font-medium">
                Contract: <small>{currentCommunity.ftContract}</small>
              </span>
            )}
          </InnerBlock.Header>
          <div>
            {isContractAddress(currentCommunity.ftContract) ? (
              <>
                ...

                <Button onClick={() => test()}>Test</Button>

              </>
            ) : (
              <DeployFTContract contract={contract} />
            )}
          </div>
        </InnerBlock>
      )}
    </div>
  );
}
