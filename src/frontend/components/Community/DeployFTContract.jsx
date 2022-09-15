import React, { useEffect, useState } from "react";
import { Button, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { factoryContract } from '../../utils/requests';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';

export function DeployFTContract({ reloadCommunityList }) {
  const dispatch = useDispatch();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: ""
  });
  const [debouncedFormData] = useDebounce(formData, 300);
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [debouncedFormDataValid] = useDebounce(isFormDataValid, 200);

  // ------------- Update Community Methods -------------

  const { config: configDeploy, error: errorDeploy } = usePrepareContractWrite({
    ...factoryContract,
    enabled: debouncedFormDataValid,
    functionName: 'deployFTContract',
    args: [currentCommunity.id, debouncedFormData.name, debouncedFormData.symbol.toUpperCase(), debouncedFormData.supply]
  });

  const { data: deployData, write: deployWrite } = useContractWrite({
    ...configDeploy,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Create your Fungible Token`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setIsLoadingCreate(false);
    },
  });

  useWaitForTransaction({
    hash: deployData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        reloadCommunityList();
      }
    },
  });

  // ------------- Form -------------

  useEffect(() => {
    setIsFormDataValid(!isFormErrors());
  }, [formData]);

  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "Error: Collection name should be more than 3 chars";
    }
    if (formData.symbol.length < 3 || formData.symbol.length > 5) {
      return "Error: Token symbol should be 3-5 chars";
    }
    if (formData.supply.length === 0 || parseInt(formData.supply) < 1) {
      return "Error: Wrong token supply";
    }
    if (!isNaN(formData.symbol.charAt(0))) {
      return "Error: Token symbol should start from letter";
    }
    return false;
  }

  // ------------- Actions -------------

  const deployFTContract = async (e) => {
    e.preventDefault();

    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsLoadingCreate(true);
    deployWrite?.();
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

        <Button disabled={isLoadingCreate || !debouncedFormDataValid} type="Submit" gradientDuoTone="purpleToPink">
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
