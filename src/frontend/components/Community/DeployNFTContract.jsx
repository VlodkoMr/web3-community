import React, { useEffect, useState } from "react";
import { Button, Spinner, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { factoryContract } from '../../utils/requests';
import { useDebounce } from 'use-debounce';

export function DeployNFTContract({ reloadCommunityList }) {
  const dispatch = useDispatch();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    supply: ""
  });
  const [debouncedFormData] = useDebounce(formData, 500);
  const [isFormDataValid, setIsFormDataValid] = useState(false);

  // ------------- Update Community Methods -------------

  const { config: configDeploy, error: errorDeploy } = usePrepareContractWrite({
    ...factoryContract,
    enabled: isFormDataValid,
    functionName: 'deployNFTCollectionContract',
    args: [currentCommunity.id, debouncedFormData.name, debouncedFormData.symbol.toUpperCase()]
  });

  const { data: deployData, write: deployWrite } = useContractWrite({
    ...configDeploy,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Create your NFT Collection`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message)
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
    console.log('errorDeploy', errorDeploy)
  }, [errorDeploy]);

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
    return false;
  }

  // ------------- Actions -------------

  const deployNFTContract = async (e) => {
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
        This section allow you create unique NFT for your community, sell it, transfer or enable minting for
        free. <br />
        To start using NFT Collections, let's enable this feature (deploy your own Smart Contract): <br />
      </p>

      <form className="flex gap-4 relative" onSubmit={deployNFTContract}>
        <div className="w-48">
          <TextInput id="name"
                     type="text"
                     required={true}
                     maxLength={50}
                     value={formData.name}
                     placeholder={`Collection Name`}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="w-36">
          <TextInput id="symbol"
                     type="text"
                     maxLength={5}
                     required={true}
                     value={formData.symbol}
                     placeholder={`Collection Symbol`}
                     onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
        </div>

        <Button disabled={isLoadingCreate} type="Submit" gradientDuoTone="purpleToPink">
          Create NFT Collection
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
