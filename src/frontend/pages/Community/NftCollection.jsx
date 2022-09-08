import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'flowbite-react';

export const NftCollection = ({ contract }) => {
  const dispatch = useDispatch();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity', currentCommunity);
  }, [currentCommunity]);

  useEffect(() => {
    if (contract) {
      console.log('Nft Collection load')
    }
  }, [contract]);

  return (
    <>
      <h3 className="text-2xl font-semibold mb-2 text-gray-600">NFT Collection</h3>
      <div>
        <p className="text-sm opacity-80 mb-4">
          This section allow you create unique NFT for your community, sell it, transfer or enable minting for
          free. <br />
          To start using NFT Collections, let's enable this feature: <br />
        </p>
        <Button>...</Button>
      </div>
    </>
  );
}
