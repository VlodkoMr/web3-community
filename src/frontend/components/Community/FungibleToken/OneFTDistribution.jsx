import React, { useEffect, useState } from "react";
import { convertFromEther, formatNumber, timestampToDate } from '../../../utils/format';
import { InnerBlock } from '../../../assets/css/common.style';
import { distributionCampaignsNFT } from '../../../utils/settings';
import { Button } from '@material-tailwind/react';

export function OneFTDistribution({ campaign, tokenSymbol }) {
  const [campaignDetails, setCampaignDetails] = useState();

  useEffect(() => {
    distributionCampaignsNFT.map(campSettings => {
      if (parseInt(campSettings.id) === campaign.distType) {
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
      <div className="flex-auto text-sm">
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

        <div>
          {tokenSymbol} per User: <b>{formatNumber(convertFromEther(campaign.tokensPerUser))}</b>
        </div>

        {campaign.eventCode > 0 && (
          <div>
            Event Code: <b>{campaign.eventCode}</b>
          </div>
        )}

        <div className={campaign.isProtected ? "font-medium" : "opacity-60"}>
          {campaign.isProtected ? "Protected" : "Not protected"} by Proof of Personhood
        </div>

        {campaign.whitelist.length > 0 && (
          <span className="absolute right-6 bottom-6 text-blue-500 cursor-pointer underline">whitelisted addresses</span>
        )}

        <div className={'mt-4'}>
          <Button color={'red'} variant={'outlined'} size={'sm'}>
            Cancel Distribution
          </Button>
        </div>
      </div>
    </InnerBlock>
  );
}
