import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { factoryFTContract } from '../../../utils/contracts';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { Loader } from '../../Loader';
import { Input, Button } from '@material-tailwind/react';

export function DeployFTContract({ reloadCommunityList }) {
  const dispatch = useDispatch();
  const [ isLoadingCreate, setIsLoadingCreate ] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);
  const [ submitFormData, setSubmitFormData ] = useState({});
  const [ formData, setFormData ] = useState({
    name: "",
    symbol: "",
    supply: ""
  });

  // ------------- Update Community Methods -------------

  const { config: configDeploy, error: errorDeploy } = usePrepareContractWrite({
    ...factoryFTContract,
    enabled: submitFormData.name?.length > 0,
    functionName: 'deployFTContract',
    args: [ currentCommunity.id, submitFormData.name, submitFormData.symbol?.toUpperCase(), submitFormData.supply ]
  });

  const { data: deployData, write: deployWrite, status: deployStatus } = useContractWrite({
    ...configDeploy,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Create your Fungible Token`
      }));
    },
    onError: ({ message }) => {
      setIsLoadingCreate(false);
      setSubmitFormData({});
      console.log('onError message', message);
    },
  });

  useWaitForTransaction({
    hash: deployData?.hash,
    onError: error => {
      console.log('is err', error);
      setSubmitFormData({});
    },
    onSuccess: data => {
      setSubmitFormData({});
      if (data) {
        reloadCommunityList();
      }
    },
  });

  useEffect(() => {
    if (deployWrite && deployStatus !== 'loading') {
      deployWrite();
    }
  }, [ deployWrite ]);

  // ------------- Form -------------

  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "Collection name should be more than 3 chars";
    }
    if (formData.symbol.length < 3 || formData.symbol.length > 5) {
      return "Token symbol should be 3-5 chars";
    }
    if (formData.supply.length === 0 || parseInt(formData.supply) < 1) {
      return "Wrong token supply";
    }
    if (!isNaN(formData.symbol.charAt(0))) {
      return "Token symbol should start from letter";
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
    setSubmitFormData({ ...formData });
  }

  return (
    <>
      <p className="text-sm opacity-80 mb-4">
        This section allow you create Token for your community, transfer or send airdrops for your NFT holders. <br/>
        To start using Fungible Token, let's enable this feature (deploy your own Smart Contract): <br/>
      </p>

      <form className="flex gap-4 relative" onSubmit={deployFTContract}>
        <div className="w-48">
          <Input type="text"
                 label="Token Name"
                 className="w-48"
                 required={true}
                 maxLength={50}
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="w-20">
          <Input type="text"
                 label="Symbol"
                 className="w-20"
                 required={true}
                 maxLength={5}
                 value={formData.symbol}
                 onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
        </div>
        <div className="w-32">
          <Input type="number"
                 label="Supply"
                 className="w-32"
                 required={true}
                 min={0}
                 value={formData.supply}
                 onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
          />
        </div>

        <Button disabled={isLoadingCreate || isFormErrors()} type="Submit" variant="gradient">
          {isLoadingCreate && (
            <span className="mr-2 align-bottom">
              <Loader size={"sm"}/>
            </span>
          )}
          Create Fungible Token
        </Button>
      </form>
    </>
  );
}
