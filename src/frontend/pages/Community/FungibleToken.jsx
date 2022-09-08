import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'flowbite-react';

export const FungibleToken = ({ contract }) => {
  const dispatch = useDispatch();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity');
  }, [currentCommunity]);

  useEffect(() => {
    if (contract) {
      console.log('FungibleToken load')
    }
  }, [contract]);

  return (
    <>
      <h3 className="text-2xl font-semibold mb-2 text-gray-600">Fungible Token</h3>
      <div>
        <p className="text-sm opacity-80 mb-4">
          This section allow you create unique your own token, transfer it or enable minting for your community. <br />
          To start using Fungible Token, let's enable this feature: <br />
        </p>
        <Button>...</Button>
      </div>
    </>
  );
}
