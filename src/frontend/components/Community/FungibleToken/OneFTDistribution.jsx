import React, { useEffect, useState } from "react";
import { convertFromEther, convertToEther, formatNumber, timestampToDate } from '../../../utils/format';
import { InnerBlock } from '../../../assets/css/common.style';
import { distributionCampaignsNFT } from '../../../utils/settings';
import { BigNumber } from '@ethersproject/bignumber';

export function OneFTDistribution({ campaign, tokenSymbol }) {
  const [campaignDetails, setCampaignDetails] = useState();

  useEffect(() => {
    console.log('campaign', campaign)
    distributionCampaignsNFT.map(campSettings => {
      if (parseInt(campSettings.id) === campaign.id) {
        setCampaignDetails(campSettings)
      }
    });
  }, [])

  const claimedPct = () => {
    const mintedPct = campaign.tokensMinted.mul(100).div(campaign.tokensTotal);
    return mintedPct.toNumber();
  }

  return (
    <InnerBlock className="mb-3">
      <div className="flex-auto">
        <h2 className="text-lg font-semibold text-gray-800">
          {formatNumber(convertFromEther(campaign.tokensTotal, 0))} {tokenSymbol} for {campaignDetails?.title}
        </h2>
        {campaign.dateStart > 0 && campaign.dateStart > 0 && (
          <span className="font-medium text-gray-500 text-sm bg-gray-100 rounded-md px-2 py-1 absolute right-6 top-6">
            {timestampToDate(campaign.dateStart)} - {timestampToDate(campaign.dateEnd)}
          </span>
        )}
        <div className="mt-2">
          Claimed: {formatNumber(convertFromEther(campaign.tokensMinted))} {tokenSymbol}
          {campaign.tokensMinted > 0 && (
            <span className="ml-2 opacity-60">
              ({claimedPct()}%)
            </span>
          )}
        </div>
        {campaign.eventCode > 0 && (
          <div>
            Event Code: <b>{campaign.eventCode}</b>
          </div>
        )}

        <div className={campaign.isProtected ? "text-gray-500" : "text-orange-500 font-medium"}>
          {campaign.isProtected ? "Not protected" : "Protected"} by World ID
        </div>
        <div className={"absolute right-6 bottom-6 text-blue-500 text-sm"}>
          Whitelisted Addresses
        </div>
      </div>
      {/*<div>distType: {campaign.distType}</div>*/}
      {/*<div>{campaign.dateStart}</div>*/}
      {/*<div>{campaign.dateEnd}</div>*/}
      {/*<div>{campaign.eventCode}</div>*/}
      {/*<div>whitelist: {campaign.whitelist}</div>*/}
      {/*<div>{campaign.tokensTotal}</div>*/}
      {/*<div>{campaign.tokensMinted}</div>*/}
      {/*<div>{campaign.tokensPerUser}</div>*/}
      {/*<div>{campaign.isProtected ? "+" : "-"}</div>*/}
    </InnerBlock>
  );
}
