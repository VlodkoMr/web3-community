import React, { useEffect, useState } from "react";
import { shortAddress } from '../../../utils/format';
import { InnerBlock } from '../../../assets/css/common.style';
import { distributionCampaignsNFT, getTokenName } from '../../../utils/settings';
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { Loader } from '../../Loader';
import { Button } from '@material-tailwind/react';
import { addTransaction } from '../../../store/transactionSlice';
import { useDispatch } from 'react-redux';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';

export function OneNFTSeries({ currentCommunity, nft, handleMint, handleCreateCampaign, handleReloadCampaigns }) {
  const { chain } = useNetwork();
  const dispatch = useDispatch();

  const { config: configCancelCampaign, error: errorCancelCampaign } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    functionName: 'cancelDistributionCampaign',
    args: [ nft?.id ]
  });

  const { data: cancelCampaignData, write: cancelCampaignWrite } = useContractWrite({
    ...configCancelCampaign,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Cancel Distribution Campaign`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
    },
  });

  useWaitForTransaction({
    hash: cancelCampaignData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        handleReloadCampaigns?.();
      }
    },
  });

  const handleCancelCampaign = () => {
    if (confirm('Please confirm Campaign cancellation')) {
      cancelCampaignWrite();
    }
  }

  return (
    <InnerBlock className="mb-4 flex-row gap-8">
      <div className="w-48 relative bg-gray-50 rounded-lg overflow-hidden">
        <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center z-0 opacity-50">
          <Loader/>
        </div>
        <img alt="" className="h-48 w-48 object-cover z-10 relative" src={nft.mediaUri}/>
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
              <span className="font-medium mr-1">Price:</span>
              {nft.price > 0 ? `${nft.price} ${getTokenName(chain)}` : "Free"}
            </div>
            <div>
              <span className="font-medium mr-1">Royalty:</span>
              {nft.royalty ? (
                <>
                  <b>{nft.royalty.percent}%</b> for {shortAddress(nft.royalty.address)}
                </>
              ) : "No"}
            </div>
            <div>
              <span className="font-medium mr-1">URL:</span> ...
            </div>
          </div>
          <div className="flex-auto ml-4">
            {nft.distribution && (
              <>
                <div>
                  <span className="font-medium mr-1">Distribution:</span>
                  <span>{distributionCampaignsNFT[nft.distribution.distType - 1]?.title}</span>
                </div>
                <div className={nft.distribution.isProtected ? "font-medium" : "opacity-60"}>
                  {nft.distribution.isProtected ? "Protected by" : "No"} Proof of Personhood
                </div>
                {nft.distribution.eventCode > 0 && (
                  <div>
                    <span className="font-medium mr-1">Event Code:</span> <b>{nft.distribution.eventCode}</b>
                  </div>
                )}
                {nft.distribution.whitelist.length > 0 && (
                  <span className={`underline text-blue-500 cursor-pointer`}>whitelisted addresses</span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex flex-row mt-4">
          <div className="inline-block">
            <Button variant="outlined" size={'sm'} onClick={handleMint}>
              Mint NFT
            </Button>
          </div>


          {nft.distribution ? (
            <>
              <Button variant="outlined"
                      color={'red'}
                      size={'sm'}
                      className={'ml-2'}
                      onClick={() => handleCancelCampaign()}>
                Cancel Distribution
              </Button>
            </>
          ) : (
            <Button variant="outlined"
                    size={'sm'}
                    className={'ml-2'}
                    onClick={handleCreateCampaign}>
              New Distribution Campaign
            </Button>
          )}

        </div>
      </div>

    </InnerBlock>
  );
}
