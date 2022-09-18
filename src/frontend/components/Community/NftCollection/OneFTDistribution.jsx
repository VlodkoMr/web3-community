import React, { useEffect, useState } from "react";
import { shortAddress } from '../../../utils/format';
import { InnerBlock } from '../../../assets/css/common.style';
import { distributionCampaigns, getTokenName } from '../../../utils/settings';
import { useNetwork } from 'wagmi';
import { Loader } from '../../Loader';
import { Button } from '@material-tailwind/react';

export function OneFTDistribution({ camp }) {
  const { chain } = useNetwork();

  return (
    <InnerBlock className="mb-4 flex-row gap-8">
      <div>distType: {camp.distType}</div>
      <div>{camp.dateStart}</div>
      <div>{camp.dateEnd}</div>
      <div>{camp.eventCode}</div>
      <div>whitelist: {camp.whitelist}</div>
      <div>{camp.tokensTotal}</div>
      <div>{camp.tokensMinted}</div>
      <div>{camp.isProtected ? "+" : "-"}</div>
    </InnerBlock>
  );
}
