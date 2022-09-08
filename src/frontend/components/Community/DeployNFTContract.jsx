import React, { useState } from "react";
import { Button, Spinner } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { loadCommunityList } from '../../utils/requests';
import { useAccount } from 'wagmi';

export function DeployNFTContract({ contract }) {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);

  const deployNFTContract = async () => {
    setIsLoadingCreate(true);
    const symbol = currentCommunity.name.toUpperCase().slice(0, 3);
    contract.deployNFTCollectionContract(currentCommunity.id, currentCommunity.name, symbol).then(tx => {
      dispatch(addTransaction({
        hash: tx.hash,
        description: `Create your NFT Collection`
      }));

      tx.wait().then(receipt => {
        setIsLoadingCreate(false);
        if (receipt.status === 1) {
          loadCommunityList(contract, dispatch, address);
        }
      });
    }).catch(err => {
      console.log('tx canceled', err);
      setIsLoadingCreate(false);
      alert("Transaction error!");
    });
  }

  return (
    <>
      <p className="text-sm opacity-80 mb-4">
        This section allow you create unique NFT for your community, sell it, transfer or enable minting for
        free. <br />
        To start using NFT Collections, let's enable this feature (deploy your own Smart Contract): <br />
      </p>
      <Button disabled={isLoadingCreate} onClick={() => deployNFTContract()} type="Submit" gradientDuoTone="purpleToPink">
        Enable NFT Collection
        {isLoadingCreate && (
          <span className="ml-2">
            <Spinner size="sm" />
          </span>
        )}
      </Button>
    </>
  );
}
