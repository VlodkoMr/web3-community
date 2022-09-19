import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { factoryNFTContract } from '../../../utils/requests';
import { Loader } from '../../Loader';
import { Input, Button } from '@material-tailwind/react';

export function DeployNFTContract({ reloadCommunityList }) {
  const dispatch = useDispatch();
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);
  const [submitFormData, setSubmitFormData] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
  });

  // ------------- Update Community Methods -------------

  const { config: configDeploy, error: errorDeploy } = usePrepareContractWrite({
    ...factoryNFTContract,
    enabled: submitFormData.name?.length > 0,
    functionName: 'deployNFTCollectionContract',
    args: [currentCommunity.id, submitFormData.name, submitFormData.symbol?.toUpperCase()]
  });

  const { data: deployData, write: deployWrite, status: deployStatus } = useContractWrite({
    ...configDeploy,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Create your NFT Collection`
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
  }, [deployWrite]);

  // ------------- Form -------------

  // Check form errors
  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "Collection name should be more than 3 chars";
    }
    if (formData.symbol.length < 3 || formData.symbol.length > 5) {
      return "Token symbol should be 3-5 chars";
    }
    if (!isNaN(formData.symbol.charAt(0))) {
      return "Token symbol should start from letter";
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
    setSubmitFormData({ ...formData });
  }

  return (
    <>
      <p className="text-sm opacity-80 mb-4">
        This section allow you create unique NFT Series for your community, create distribution campaign to sell or
        minting NFT for free. <br />
        To start using NFT Collections, let's enable this feature (deploy your own Smart Contract): <br />
      </p>

      <form className="flex gap-4 relative" onSubmit={deployNFTContract}>
        <div className="w-48">
          <Input type="text"
                 label="Collection Name"
                 className="w-48"
                 required={true}
                 maxLength={50}
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}

          />
        </div>
        <div className="w-36">
          <Input type="text"
                 label="Symbol"
                 className="w-36"
                 required={true}
                 maxLength={5}
                 value={formData.symbol}
                 onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          />
        </div>

        <Button disabled={isLoadingCreate || isFormErrors()} type="Submit" variant="gradient">
          {isLoadingCreate && (
            <span className="mr-2 align-bottom">
              <Loader size={"sm"} />
            </span>
          )}
          Create NFT Collection
        </Button>
      </form>
    </>
  );
}
