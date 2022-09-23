import React, { useEffect, useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { useAccount, useContractRead, useNetwork, useProvider } from 'wagmi';
import { convertFromEther, formatNumber, isContractAddress } from '../../utils/format';
import { transformFTCampaign } from '../../utils/transform';
import { useOutletContext } from 'react-router-dom';
import { Button, Textarea } from '@material-tailwind/react';
import { DeployFTContract } from '../../components/MyCommunity/FungibleToken/DeployFTContract';
import { DistributionCampaignFTPopup } from '../../components/MyCommunity/FungibleToken/DistributionCampaignFTPopup';
import { OneFTDistribution } from '../../components/MyCommunity/FungibleToken/OneFTDistribution';
import { PauseUnpausePopup } from '../../components/MyCommunity/PauseUnpausePopup';
import { AirdropFTPopup } from "../../components/MyCommunity/FungibleToken/AirdropFTPopup";
import FungibleTokenABI from '../../contractsData/FungibleToken.json';
import { Loader } from "../../components/Loader";

export const FungibleToken = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const [ reloadCommunityList ] = useOutletContext();
  const currentCommunity = useSelector(state => state.community.current);
  const [ campaignPopupVisible, setCampaignPopupVisible ] = useState(false);
  const [ airdropPopupVisible, setAirdropPopupVisible ] = useState(false);
  const [ tokenSymbol, setTokenSymbol ] = useState("");
  const [ totalSupply, setTotalSupply ] = useState("");
  const [ myBalance, setMyBalance ] = useState("");
  const [ isTokenReady, setIsTokenReady ] = useState(false);

  const myFTContract = {
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
  };

  // const { data: totalSupply } = useContractRead({
  //   ...myFTContract,
  //   enabled: isContractAddress(currentCommunity?.ftContract),
  //   functionName: "totalSupply",
  // });
  // const { data: tokenSymbol } = useContractRead({
  //   ...myFTContract,
  //   enabled: isContractAddress(currentCommunity?.ftContract),
  //   functionName: "symbol",
  // });


  // const { data: myBalance, refetch: refetchBalance } = useContractRead({
  //   ...myFTContract,
  //   enabled: isContractAddress(currentCommunity?.ftContract),
  //   functionName: "balanceOf",
  //   args: [ address ]
  // });

  const { data: distributionCampaigns, refetch: refetchDistributionCampaigns } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "getCampaigns",
    select: (data) => data.map(camp => transformFTCampaign(camp))
  });

  const refetchCampaignsList = () => {
    // refetchBalance();
    refetchDistributionCampaigns();
    loadSuperToken();
  }

  const loadSuperToken = async () => {
    const sf = await Framework.create({
      chainId: chain.id,
      provider
    });
    const superToken = await sf.loadSuperToken(currentCommunity.ftContract);
    const symbol = await superToken.symbol({ providerOrSigner: provider });
    const supply = await superToken.totalSupply({ providerOrSigner: provider });
    const myBalance = await superToken.balanceOf({ providerOrSigner: provider, account: address });

    setTokenSymbol(symbol);
    setTotalSupply(supply);
    setMyBalance(myBalance);
    setIsTokenReady(true);
  }

  useEffect(() => {
    if (currentCommunity?.ftContract) {
      loadSuperToken();
    }
  }, [ currentCommunity?.ftContract ])

  useEffect(() => {
    console.log('distributionCampaigns', distributionCampaigns)
  }, [ distributionCampaigns ])

  return (
    <div className="flex flex-row">
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Fungible Token</span>
          {isContractAddress(currentCommunity?.ftContract) && (
            <PauseUnpausePopup contractAddress={currentCommunity.ftContract}
                               contractABI={FungibleTokenABI}
                               handleSuccess={reloadCommunityList}
            />
          )}
        </InnerBlock.Header>
        <div>
          {isContractAddress(currentCommunity.ftContract) ? (
            <>
              <div className="flex justify-between text-sm mb-3 -mt-1">
                <div className="mr-10">
                  <span>Total Supply:</span>
                  {isTokenReady ? (
                    <b className="ml-1 font-medium">{formatNumber(convertFromEther(totalSupply, 0))} {tokenSymbol}</b>
                  ) : (
                    <span className="ml-2">
                      <Loader size={"sm"}/>
                    </span>
                  )}

                </div>
                <span className="text-sm font-normal text-slate-500">
                  <span className="font-medium mr-1">Contract:</span>
                  <small className="opacity-80">{currentCommunity.ftContract}</small>
                </span>
              </div>

              <hr className="mb-6"/>

              <div className="flex flex-row gap-8">
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
                        <OneFTDistribution key={campaign.id}
                                           campaign={campaign}
                                           tokenSymbol={tokenSymbol}
                                           currentCommunity={currentCommunity}
                        />
                      ))}
                    </>
                  ) : (
                    <InnerBlock className={"text-center text-gray-500"}>
                      *No Distribution Campaigns
                    </InnerBlock>
                  )}
                </div>
                <div className="w-1/3">
                  <div className="-mt-3 mb-3 flex justify-end">
                    <Button onClick={() => setAirdropPopupVisible(true)}>
                      New Token Airdrop
                    </Button>
                  </div>

                  <div className="bg-white rounded-xl shadow-gray-300/50 shadow-lg px-8 py-6 mb-6 text-center">
                    <h4>
                      <span className={"mr-2"}>My Balance:</span>
                      {isTokenReady ? (
                        <b>{formatNumber(convertFromEther(myBalance, 0))} {tokenSymbol}</b>
                      ) : (<Loader size={"sm"}/>)}
                    </h4>
                  </div>

                  {distributionCampaigns?.length > 0 && (
                    <>
                      <InnerBlock className={"text-center mb-8"}>
                        <div className={"w-full"}>
                          <h4 className="mb-3 pb-3 font-semibold border-b">Tokenomic</h4>
                          <Textarea label={`${tokenSymbol} usage and distribution details`}/>
                        </div>
                      </InnerBlock>
                    </>
                  )}
                </div>
              </div>
            </>
          ) : (
            <DeployFTContract reloadCommunityList={reloadCommunityList}/>
          )}
        </div>
      </InnerTransparentBlock>

      <AirdropFTPopup
        popupVisible={airdropPopupVisible}
        setPopupVisible={setAirdropPopupVisible}
        currentCommunity={currentCommunity}
        tokenSymbol={tokenSymbol}
        myBalance={myBalance}
        tokenAddress={currentCommunity?.ftContract}
        handleSuccess={() => refetchCampaignsList()}
      />

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
