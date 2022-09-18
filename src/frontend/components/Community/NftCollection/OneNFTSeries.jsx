import React, { useEffect, useState } from "react";
import { shortAddress } from '../../../utils/format';
import { InnerBlock } from '../../../assets/css/common.style';
import { distributionCampaigns, getTokenName } from '../../../utils/settings';
import { useNetwork } from 'wagmi';
import { Loader } from '../../Loader';
import { Button } from '@material-tailwind/react';

export function OneNFTSeries({ nft, handleMint, handleCreateCampaign }) {
  const { chain } = useNetwork();

  return (
    <InnerBlock className="mb-4 flex-row gap-8">
      <div className="w-48 relative bg-gray-50 rounded-lg overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center z-0 opacity-50">
          <Loader />
        </div>
        <img alt="" className="h-48 w-48 object-cover z-10 relative" src={nft.mediaUri} />
      </div>

      <div className="flex-auto">
        <h2 className="text-xl pt-3 font-semibold text-gray-800">{nft.title}</h2>
        <div className="inline-block">
          <span className="font-medium text-gray-500 text-sm bg-gray-100 rounded-md px-2 py-1">
              {nft.mintedTotal}{nft.supply === 0 ? "" : "/" + nft.supply} minted NFT
            </span>
        </div>

        <div className="flex flex-row mt-4 text-sm">
          <div className="w-64">
            <div>
              <span className="font-semibold mr-1">Price:</span>
              {nft.price > 0 ? `${nft.price} ${getTokenName(chain)}` : "Free"}
            </div>
            <div>
              <span className="font-semibold mr-1">Royalty:</span>
              {nft.royalty ? (
                <>
                  <b>{nft.royalty.percent}%</b> for {shortAddress(nft.royalty.address)}
                </>
              ) : "No"}
            </div>
          </div>
          <div className="flex-auto">
            {nft.distribution && (
              <>
                <div className="mb-1 block text-left">
                  <span className="font-semibold mr-1">Distribution:</span>
                  <span>{distributionCampaigns[nft.distribution.distType]}</span>
                </div>
                <div>
                  <span className="font-semibold mr-1">URL:</span>: ...
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row mt-4">
          <div className="opacity-80 hover:opacity-100 inline-block">
            <Button variant="outlined" size={'sm'} onClick={handleMint}>
              Mint NFT
            </Button>
          </div>


          <div className="opacity-80 hover:opacity-100 inline-block ml-2">
            {nft.distribution ? (
              <Button variant="outlined" size={'sm'} onClick={handleCreateCampaign}>
                Cancel Distribution
              </Button>
            ) : (
              <Button variant="outlined" size={'sm'} onClick={handleCreateCampaign}>
                New Distribution Campaign
              </Button>
            )}
          </div>

        </div>
      </div>

    </InnerBlock>
  );
}
