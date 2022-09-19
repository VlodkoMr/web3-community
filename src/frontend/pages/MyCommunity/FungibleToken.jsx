import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { useAccount, useContractRead } from 'wagmi';
import FungibleTokenABI from '../../contractsData/FungibleToken.json';
import { convertFromEther, formatNumber, isContractAddress } from '../../utils/format';
import { DeployFTContract } from '../../components/Community/FungibleToken/DeployFTContract';
import { useOutletContext } from 'react-router-dom';
import { Button, Textarea } from '@material-tailwind/react';
import { DistributionCampaignFTPopup } from '../../components/Community/FungibleToken/DistributionCampaignFTPopup';
import { transformFTCampaign } from '../../utils/transform';
import { OneFTDistribution } from '../../components/Community/FungibleToken/OneFTDistribution';

export const FungibleToken = () => {
  const { address } = useAccount();
  const [reloadCommunityList] = useOutletContext();
  const currentCommunity = useSelector(state => state.community.current);
  const [campaignPopupVisible, setCampaignPopupVisible] = useState(false);

  const myFTContract = {
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
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
  const { data: myBalance, refetch: refetchBalance } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "balanceOf",
    args: [address]
  });

  const { data: distributionCampaigns, refetch: refetchDistributionCampaigns } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "getCampaigns",
    select: (data) => data.map(camp => transformFTCampaign(camp))
  });

  const refetchCampaignsList = () => {
    refetchBalance();
    refetchDistributionCampaigns();
  }

  const pauseContract = () => {
    if (confirm("Paused contract don't allow minting or transfer NFT. Are you sure?")) {
      // pause
    }
  }

  useEffect(() => {
    console.log('distributionCampaigns', distributionCampaigns)
  }, [distributionCampaigns])

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

              <div className="flex flex-row gap-12">
                <div className="w-2/3">
                  <div className="flex justify-between">
                    <h4 className="mb-3 mt-1 font-semibold">Distribution Campaigns</h4>
                    <div className="-mt-3">
                      <Button onClick={() => setCampaignPopupVisible(true)}>
                        New Distribution Campaign
                      </Button>
                    </div>
                  </div>
                  {distributionCampaigns?.length > 0 ? (
                    <>
                      {distributionCampaigns.map(campaign => (
                        <OneFTDistribution key={campaign.id} campaign={campaign} tokenSymbol={tokenSymbol} />
                      ))}
                    </>
                  ) : (
                    <InnerBlock className={"text-center text-gray-500"}>
                      *No Distribution Campaigns
                    </InnerBlock>
                  )}
                </div>
                <div className="w-1/3">
                  <h4 className="mb-3 mt-1 font-semibold">My Wallet Balance</h4>
                  <div className="bg-white rounded-xl shadow-gray-300/50 shadow-lg px-8 py-6 text-center">
                    <b>{formatNumber(convertFromEther(myBalance, 0))} {tokenSymbol}</b>
                  </div>

                  {distributionCampaigns?.length > 0 && (
                    <>
                      <h4 className="mt-6 mb-2 font-semibold">Tokenomic</h4>
                      <InnerBlock className={"text-center"}>
                        <div>
                          <small className="text-gray-500 block mb-3">
                            Describe your <b>{tokenSymbol}</b> token usage and distribution details:
                          </small>
                          <Textarea label={`${tokenSymbol} tokenomic`} />
                        </div>
                      </InnerBlock>
                    </>
                  )}
                </div>
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
        myBalance={myBalance}
        handleSuccess={() => refetchCampaignsList()}
      />
    </div>
  );
}
