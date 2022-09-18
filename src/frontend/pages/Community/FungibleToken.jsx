import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { useAccount, useContractRead, useSigner } from 'wagmi';
import FungibleTokenABI from '../../contractsData/FungibleToken.json';
import { convertFromEther, formatNumber, isContractAddress } from '../../utils/format';
import { DeployFTContract } from '../../components/Community/DeployFTContract';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { DistributionCampaignFTPopup } from '../../components/Community/NftCollection/DistributionCampaignFTPopup';

export const FungibleToken = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [reloadCommunityList] = useOutletContext();
  const currentCommunity = useSelector(state => state.community.current);
  const [campaignPopupVisible, setCampaignPopupVisible] = useState(false);

  const myFTContract = {
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
  };

  const { data: totalSupply, refetch, error } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "totalSupply",
  });

  const { data: tokenSymbol } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "symbol",
  });
  const { data: myBalance } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "balanceOf",
    args: [address],
    watch: true
  });

  const refetchCampaignsList = () => {
  }

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
            <Button size="sm"
                    color="red"
                    variant="outlined"
                    className={"px-3 py-0.5"}
                    onClick={pauseContract}>
              Pause Contract
            </Button>
          )}
        </InnerBlock.Header>
        <div>
          {isContractAddress(currentCommunity.ftContract) ? (
            <>
              <div className="flex justify-between text-sm mb-3 -mt-1">
                <div className="mr-10">
                  <span>Total Supply:</span>
                  <b className="ml-1 font-medium">{formatNumber(convertFromEther(totalSupply, 0))} {tokenSymbol}</b>
                </div>
                <span className="text-sm font-normal text-slate-500">
                  <span className="font-medium mr-1">Contract:</span>
                  <small className="opacity-80">{currentCommunity.ftContract}</small>
                </span>
              </div>

              <hr className="mb-6" />
              <div className="flex flex-row justify-between text-sm mb-6">
                <div>
                  Wallet Balance:
                  <b className="ml-1">{formatNumber(convertFromEther(myBalance, 0))} {tokenSymbol}</b>
                </div>

                <div className="-mt-3 justify-end">
                  <Button onClick={() => setCampaignPopupVisible(true)}>
                    New Distribution Campaign
                  </Button>
                </div>
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

      <DistributionCampaignFTPopup
        popupVisible={campaignPopupVisible}
        setPopupVisible={setCampaignPopupVisible}
        currentCommunity={currentCommunity}
        tokenSymbol={tokenSymbol}
        handleSuccess={() => refetchCampaignsList()}
      />
    </div>
  );
}
