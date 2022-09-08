import React, { useState } from "react";
import { Button, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { loadCommunityList } from '../../utils/requests';
import { useAccount } from 'wagmi';

export function DeployFTContract({ contract }) {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: ""
  });

  const deployFTContract = async (e) => {
    e.preventDefault();

    if (formData.name.length < 3) {
      alert("Error: Token name should be longer than 3 chars");
      return;
    }
    if (formData.symbol.length < 3 || formData.symbol.length > 5) {
      alert("Error: Token symbol should be 3-5 chars");
      return;
    }
    if (parseInt(formData.supply) < 1) {
      alert("Error: Wrong token supply");
      return;
    }

    setIsLoadingCreate(true);
    contract.deployFTContract(currentCommunity.id, formData.name, formData.symbol.toUpperCase(), formData.supply).then(tx => {
      dispatch(addTransaction({
        hash: tx.hash,
        description: `Create your Fungible Token`
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
        This section allow you create Token for your community, transfer or send airdrops for your NFT holders. <br />
        To start using Fungible Token, let's enable this feature (deploy your own Smart Contract): <br />
      </p>

      <form className="flex gap-4 relative" onSubmit={deployFTContract}>
        <div className="w-32">
          <TextInput id="name"
                     type="text"
                     required={true}
                     maxLength={50}
                     value={formData.name}
                     placeholder={`Token Name`}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="w-32">
          <TextInput id="symbol"
                     type="text"
                     maxLength={5}
                     required={true}
                     value={formData.symbol}
                     placeholder={`Token Symbol`}
                     onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
        </div>
        <div className="w-32">
          <TextInput id="supply"
                     type="number"
                     min={0}
                     maxLength={5}
                     required={true}
                     value={formData.supply}
                     placeholder={`Total Supply`}
                     onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
          />
        </div>

        <Button disabled={isLoadingCreate} type="Submit" gradientDuoTone="purpleToPink">
          Create Fungible Token
          {isLoadingCreate && (
            <span className="ml-2">
            <Spinner size="sm" />
          </span>
          )}
        </Button>
      </form>
    </>
  );
}
