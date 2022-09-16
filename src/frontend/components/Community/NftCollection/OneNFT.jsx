import React, { useEffect, useState } from "react";
import { Button, Spinner, Badge } from 'flowbite-react';
import { shortAddress } from '../../../utils/format';
import { InnerBlock } from '../../../assets/css/common.style';
import { getTokenName } from '../../../utils/settings';
import { useNetwork } from 'wagmi';

export function OneNFT({ nft, handleMint }) {
  const { chain } = useNetwork();

  return (
    <InnerBlock className="mb-4 flex-row gap-8">
      <div className="w-48 relative bg-gray-50 rounded-lg">
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center z-0 opacity-50">
          <Spinner size="lg" color="gray" />
        </div>
        <img alt="" className="h-48 w-48 object-cover z-10 relative" src={nft.mediaUri} />
      </div>

      <div className="flex-auto">
        <h2 className="text-xl pt-4 font-semibold text-gray-800">{nft.title}</h2>
        <div className="inline-block">
          <Badge color="gray" size="sm">
            <span className="font-medium text-gray-500">
              {nft.mintedTotal}{nft.supply === 0 ? "" : "/" + nft.supply} minted NFT
            </span>
          </Badge>
        </div>

        <div className="mt-4 text-sm">
          <span className="font-semibold mr-1">Price:</span>
          {nft.price > 0 ? `${nft.price} ${getTokenName(chain)}` : "Free"}
        </div>
        <div className="text-sm">
          <span className="font-semibold mr-1">Royalty:</span>
          {nft.royalty ? (
            <>
              <b>{nft.royalty.percent}%</b> for {shortAddress(nft.royalty.address)}
            </>
          ) : "No"}
        </div>

        <div className="flex flex-row mt-4">
          <div className="opacity-80 hover:opacity-100 inline-block mr-2">
            <Button outline={true} gradientDuoTone="purpleToPink">
              Create Campaign
            </Button>
          </div>
          <div className="opacity-80 hover:opacity-100 inline-block">
            <Button outline={true} gradientDuoTone="purpleToPink" onClick={handleMint}>
              Mint NFT
            </Button>
          </div>
        </div>
      </div>
    </InnerBlock>
  );
}
