import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from 'flowbite-react';
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { useAccount, useContractRead, useSigner } from 'wagmi';
import { convertFromEther, FormatNumber, isContractAddress } from '../../utils/format';
import { ethers } from 'ethers';
import FungibleTokenABI from '../../contractsData/FungibleToken.json';
import { DeployFTContract } from '../../components/Community/DeployFTContract';
import { useOutletContext } from 'react-router-dom';
import NFTCollectionABI from '../../contractsData/NFTCollection.json';

export const FungibleToken = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [reloadCommunityList] = useOutletContext();
  const currentCommunity = useSelector(state => state.community.current);

  // const [isReady, setIsReady] = useState(false);
  // const [myFTContract, setMyFTContract] = useState();
  // const [myFTDetails, setMyFTDetails] = useState({
  //   name: "",
  //   symbol: "",
  //   supply: 0,
  //   balance: 0,
  // });

  const myFTContract = {
    addressOrName: currentCommunity?.ftContract,
    contractInterface: NFTCollectionABI.abi,
  };

  const { data: totalSupply } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "totalSupply",
  });
  const { data: tokenSymbol } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "symbol",
  });
  const { data: tokenName } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "name",
  });
  const { data: myBalance } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "balanceOf",
    args: [address]
  });

  // useEffect(() => {
  //   setIsReady(false);
  //   if (currentCommunity && currentCommunity.id) {
  //     // Init NFT Contract interface
  //     if (isContractAddress(currentCommunity.ftContract)) {
  //       loadMyFTContract();
  //     }
  //     setIsReady(true);
  //   }
  // }, [currentCommunity]);
  //
  // useEffect(() => {
  //   if (myFTContract) {
  //     loadMyFTDetails();
  //   }
  // }, [myFTContract]);
  //
  // const loadMyFTContract = () => {
  //   const contract = new ethers.Contract(
  //     currentCommunity.ftContract,
  //     FungibleTokenABI.abi,
  //     signer
  //   );
  //   setMyFTContract(contract);
  // }
  //
  // const loadMyFTDetails = async () => {
  //   setMyFTDetails({
  //     name: await myFTContract.name(),
  //     symbol: await myFTContract.symbol(),
  //     supply: await myFTContract.totalSupply(),
  //     balance: await myFTContract.balanceOf(address),
  //   })
  // }
  //
  // const test = async () => {
  //   if (myFTContract) {
  //     console.log('myFTContract', myFTContract);
  //     const owner = await myFTContract.owner();
  //     console.log('owner', owner);
  //   }
  // }

  const pauseContract = () => {
    if (confirm("Paused contract don't allow minting or transfer NFT. Are you sure?")) {
      // pause
    }
  }

  return (
    <div className="flex flex-row">
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Fungible Token</span>
          {isContractAddress(currentCommunity?.ftContract) && (
            <Button size="xsm" color="light" onClick={pauseContract}>
              <span className="text-sm px-2 font-medium text-red-500">Pause Contract</span>
            </Button>
          )}
        </InnerBlock.Header>
        <div>
          {isContractAddress(currentCommunity.ftContract) ? (
            <>
              <div className="flex justify-between text-sm mb-3 -mt-1">
                <div className="mr-10">
                  <span className="opacity-80">Token Name:</span>
                  <b className="font-medium ml-1">{tokenName}</b>
                </div>
                <span className="text-sm font-normal text-slate-500">
                  <span className="font-medium mr-1">Total Supply:</span>
                  <b className="ml-1">{FormatNumber(convertFromEther(totalSupply, 0))} {tokenSymbol}</b>
                </span>
              </div>

              <hr className="mb-6" />
              <div className="flex text-sm mb-6">
                Wallet Balance: <b
                className="ml-1">{FormatNumber(convertFromEther(myBalance, 0))} {tokenSymbol}</b>
              </div>

              <div className="flex text-sm gap-3">
                {/*<Button onClick={() => test()}>Add Token to Metamask</Button>*/}
                {/*<Button onClick={() => test()}>Create Tokens Airdrop</Button>*/}
              </div>
            </>
          ) : (
            <DeployFTContract reloadCommunityList={reloadCommunityList} />
          )}
        </div>
      </InnerTransparentBlock>
    </div>
  );
}
