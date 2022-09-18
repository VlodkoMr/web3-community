import React, { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import FungibleTokenABI from '../../../contractsData/FungibleToken.json';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { distributionCampaigns } from '../../../utils/settings';
import { Checkbox, Textarea, Input, Radio, Button } from '@material-tailwind/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Loader } from '../../Loader';
import { Popup } from '../../Popup';
import { convertToEther } from '../../../utils/format';
import Big from 'big.js';

export function DistributionCampaignFTPopup({
  popupVisible,
  setPopupVisible,
  handleSuccess,
  currentCommunity,
  tokenSymbol,
  myBalance,
}) {
  const dispatch = useDispatch();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [isTokensApproved, setIsTokensApproved] = useState(false);
  const [submitFormData, setSubmitFormData] = useState({});
  const [formData, setFormData] = useState({
    distributionType: "",
    dateFrom: "",
    dateTo: "",
    whitelisted: "",
    isLimit: false,
    tokensAmount: ""
  });

  // ------------ Approve token transfer ------------

  const { config: configApprove, error: errorApprove } = usePrepareContractWrite({
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
    enabled: submitFormData?.distributionType > 0 && submitFormData.tokensAmount > 0,
    functionName: 'approve',
    args: [currentCommunity?.ftContract, submitFormData.tokensAmount]
  });

  const { data: approveData, write: approveWrite } = useContractWrite({
    ...configApprove,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Approve token transfer`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setIsSubmitLoading(false);
    },
  });

  useWaitForTransaction({
    hash: approveData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        setIsTokensApproved(true);
      }
    },
  });

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsSubmitLoading(true);

    let dateFrom = 0;
    let dateTo = 0;
    if (formData.dateFrom.length) {
      dateFrom = new Date(formData.dateFrom).getTime();
    }
    if (formData.dateTo.length) {
      dateTo = new Date(formData.dateTo).getTime();
    }
    const distributionType = parseInt(formData.distributionType);
    let whitelisted = [];
    if (distributionType === 4) {
      formData.whitelisted.replace("\n", ",").split(",").map(address => {
        if (address.length > 3) {
          whitelisted.push(address.trim());
        }
      });
    }

    setSubmitFormData({
      distributionType,
      dateFrom,
      dateTo,
      whitelisted: whitelisted,
      isLimit: formData.isLimit,
      tokensAmount: convertToEther(formData.tokensAmount)
    });
  }

  // ------------ Create Distribution Campaign ------------

  const { config: configCreate, error: errorCreate } = usePrepareContractWrite({
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
    enabled: isTokensApproved,
    functionName: 'createDistributionCampaign',
    args: [submitFormData.distributionType, submitFormData.dateFrom, submitFormData.dateTo, submitFormData.whitelisted, submitFormData.isLimit, submitFormData.tokensAmount]
  });

  const { data: createData, write: createWrite } = useContractWrite({
    ...configCreate,
    onSuccess: ({ hash }) => {
      setPopupVisible(false);
      setIsSubmitLoading(false);
      resetForm();

      dispatch(addTransaction({
        hash: hash,
        description: `Create Distribution Campaign`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setIsSubmitLoading(false);
    },
  });

  useWaitForTransaction({
    hash: createData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        handleSuccess?.();
      }
    },
  });

  // ------------ Actions ------------

  // call contract write when all is ready
  useEffect(() => {
    // submit data if we receive json result URL
    if (approveWrite && submitFormData?.distributionType > 0 && submitFormData.tokensAmount > 0) {
      approveWrite();
    }
  }, [approveWrite]);

  useEffect(() => {
    if (createWrite && isTokensApproved) {
      createWrite();
    }
  }, [createWrite]);

  const resetForm = () => {
    setSubmitFormData({});
    setFormData({
      distributionType: "",
      dateFrom: "",
      dateTo: "",
      whitelisted: "",
      isLimit: false,
      tokensAmount: ""
    });
  }

  const isFormErrors = () => {
    if (!parseInt(formData.distributionType)) {
      return "Select campaign Distribution Strategy";
    }
    if (parseInt(formData.tokensAmount) < 1) {
      return "Please provide amount of tokens for Campaign";
    }
    if (Big(myBalance).lt(Big(convertToEther(formData.tokensAmount)))) {
      return "Not enough tokens balance in your wallet";
    }
    return false;
  }

  return (
    <>
      <Popup title="Create Distribution Campaign"
             isVisible={popupVisible}
             size={"lg"}
             setIsVisible={setPopupVisible}>
        <form className="flex flex-row gap-8 relative" onSubmit={handleCreateCampaign}>
          <div className="w-1/3">
            <div className="mb-1 block text-left font-semibold">
              Distribution Settings
            </div>
            <div>
              <Input type="number"
                     label={`Total ${tokenSymbol} Amount*`}
                     className="flex-1"
                     required={true}
                     maxLength={50}
                     value={formData.tokensAmount}
                     onChange={(e) => setFormData({ ...formData, tokensAmount: e.target.value })}
              />
            </div>
            <div className="flex flex-row gap-4 mt-4">
              <div className="flex-1 mb-4">
                <Input type="date"
                       label="Start Date"
                       value={formData.dateFrom}
                       onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                />
              </div>
              <div className="flex-1 ">
                <Input type="date"
                       label="End Date"
                       value={formData.dateTo}
                       onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-1 block text-left font-semibold mt-2">
              Proof of Personhood by World ID
            </div>
            <div className="flex justify-between bg-yellow-50 text-sm font-medium pl-2 pr-6 py-2 rounded-md
              border border-orange-200">
              <Checkbox label="Limit: 1 mint/person"
                        color="amber"
                        onChange={() => setFormData({ ...formData, isLimit: !formData.isLimit })}
                        className="font-semibold" />
              <a href="https://worldcoin.org/"
                 className="underline pt-3 text-blue-500"
                 target="_blank">
                read more
              </a>
            </div>
          </div>

          <div className="w-2/3">
            <div className="mb-1 block text-left font-semibold">
              Choose Distribution Strategy
            </div>
            <div>
              {distributionCampaigns.map(campaign => (
                <label key={campaign.id}
                       className={`flex flex-row bg-gray-100 mb-1 pl-2 pr-6 py-2 border border-transparent 
                         hover:border-gray-200 rounded-lg cursor-pointer 
                         ${campaign.isAvailable ? "" : "opacity-60"}`}>
                  <Radio name="type"
                         disabled={!campaign.isAvailable}
                         value={campaign.id}
                         size="sm"
                         checked={campaign.id === formData.distributionType}
                         onChange={() => setFormData({ ...formData, distributionType: campaign.id })}
                  />
                  <div>
                    <span className="text-lg text-gray-800 font-semibold">{campaign.title}</span>
                    <p className="text-sm font-medium text-gray-600">{campaign.text}</p>
                    {campaign.id === "2" && formData.distributionType === campaign.id && (
                      <div className={"text-sm mt-6"}>
                        <Textarea label="List of Addresses:"
                                  variant={"static"}
                                  placeholder="Wallet addresses separated by coma"
                                  onChange={(e) => setFormData({ ...formData, whitelisted: e.target.value })}
                                  value={formData.whitelisted}
                        />
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-between mt-8 ">
              <div className="text-gray-500 text-sm pt-2" />
              <Button type="Submit" variant="gradient">
                Create Campaign
                <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block" />
              </Button>
            </div>
          </div>

          {isSubmitLoading && (
            <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
              <div className={"w-12 mx-auto mt-10"}>
                <Loader />
              </div>
            </div>
          )}
        </form>
      </Popup>
    </>
  );
}