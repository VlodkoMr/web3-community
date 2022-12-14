import React, { useEffect, useState } from "react";
import { useContractWrite, useNetwork, usePrepareContractWrite, useProvider, useWaitForTransaction } from 'wagmi';
import FungibleTokenABI from '../../../contractsData/FungibleToken.json';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { distributionCampaignsFT } from '../../../utils/settings';
import { Checkbox, Textarea, Input, Radio, Button } from '@material-tailwind/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Loader } from '../../Loader';
import { Popup } from '../../Popup';
import { convertToEther } from '../../../utils/format';
import { BigNumber } from '@ethersproject/bignumber';
import { Framework } from "@superfluid-finance/sdk-core";

export function DistributionCampaignFTPopup(
  {
    popupVisible,
    setPopupVisible,
    handleSuccess,
    currentCommunity,
    tokenSymbol,
    myBalance,
  }) {
  const dispatch = useDispatch();
  const provider = useProvider();
  const { chain } = useNetwork();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ approveFormData, setApproveFormData ] = useState({});
  const [ submitFormData, setSubmitFormData ] = useState({});
  const [ isLimit, setIsLimit ] = useState(false);
  const [ formData, setFormData ] = useState({
    distributionType: "",
    dateFrom: "",
    dateTo: "",
    whitelisted: "",
    actionId: "",
    tokensAmount: "",
    tokensPerUser: ""
  });

  // ------------ Approve token transfer ------------

  const { config: configApprove, error: errorApprove } = usePrepareContractWrite({
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
    enabled: approveFormData?.distributionType > 0 && approveFormData.tokensAmount > 0,
    functionName: 'approve',
    args: [ currentCommunity?.ftContract, approveFormData.tokensAmount ]
  });

  const { data: approveData, write: approveWrite, status: approveStatus } = useContractWrite({
    ...configApprove,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Approve token transfer`
      }));
    },
    onError: ({ message }) => {
      setIsLoading(false);
      setApproveFormData({});
      console.log('onError message', message);
    },
  });

  useWaitForTransaction({
    hash: approveData?.hash,
    onError: error => {
      setIsLoading(false);
      setApproveFormData({});
      console.log('is err', error);
    },
    onSuccess: data => {
      if (data) {
        setSubmitFormData({ ...approveFormData });
        setApproveFormData({});
      }
    },
  });

  // call contract write when all is ready
  useEffect(() => {
    if (approveWrite && approveStatus !== 'loading') {
      approveWrite();
    }
  }, [ approveWrite ]);

  // ------------ Create Distribution Campaign ------------

  const { config: configCreate, error: errorCreate } = usePrepareContractWrite({
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi,
    enabled: submitFormData?.distributionType > 0 && submitFormData?.tokensAmount > 0,
    functionName: 'createDistributionCampaign',
    args: [
      submitFormData.distributionType, submitFormData.dateFrom, submitFormData.dateTo, submitFormData.whitelisted || [],
      submitFormData.actionId, submitFormData.tokensAmount, submitFormData.tokensPerUser
    ]
  });

  const { data: createData, write: createWrite, status: createStatus } = useContractWrite({
    ...configCreate,
    onSuccess: ({ hash }) => {
      setPopupVisible(false);
      setSubmitFormData({});
      resetForm();

      dispatch(addTransaction({
        hash: hash,
        description: `Create Distribution Campaign`
      }));
    },
    onError: ({ message }) => {
      setIsLoading(false);
      setSubmitFormData({});
      console.log('onError message', message);
    },
  });

  useWaitForTransaction({
    hash: createData?.hash,
    onError: error => {
      console.log('is err', error);
      setIsLoading(false);
      setSubmitFormData({});
    },
    onSuccess: data => {
      setIsLoading(false);
      if (data) {
        handleSuccess?.();
      }
    },
  });

  useEffect(() => {
    if (createWrite && createStatus !== 'loading') {
      createWrite();
    }
  }, [ createWrite ]);

  useEffect(() => {
    console.log(`errorApprove`, errorApprove);
  }, [ errorApprove ]);

  // ------------ Actions ------------

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsLoading(true);

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
    if (distributionType === 2) {
      formData.whitelisted.replace("\n", ",").split(",").map(address => {
        if (address.length > 3) {
          whitelisted.push(address.trim());
        }
      });
    }

    setApproveFormData({
      distributionType,
      dateFrom,
      dateTo,
      whitelisted,
      actionId: formData.actionId,
      tokensAmount: convertToEther(formData.tokensAmount),
      tokensPerUser: convertToEther(formData.tokensPerUser)
    });
  }

  // const approveToken = async () => {
  //   const sf = await Framework.create({
  //     chainId: chain.id,
  //     provider
  //   });
  //   const superToken = await sf.loadSuperToken(currentCommunity.ftContract);
  //   superToken.approve({
  //     receiver: currentCommunity.ftContract,
  //     amount: convertToEther(formData.tokensAmount)
  //   });
  //
  //   setSubmitFormData({ ...approveFormData });
  //   setApproveFormData({});
  // }
  //
  // useEffect(() => {
  //   if (approveFormData?.distributionType) {
  //     console.log(`+`);
  //     approveToken();
  //   }
  // }, [ approveFormData ])

  const resetForm = () => {
    setIsLimit(false);
    setSubmitFormData({});
    setApproveFormData({});
    setFormData({
      distributionType: "",
      dateFrom: "",
      dateTo: "",
      whitelisted: "",
      actionId: "",
      tokensAmount: "",
      tokensPerUser: ""
    });
  }

  const isFormErrors = () => {
    if (!parseInt(formData.distributionType)) {
      return "Select campaign Distribution Strategy";
    }
    if (parseInt(formData.tokensAmount) < 1) {
      return "Please provide amount of tokens for Campaign";
    }
    if (parseInt(formData.tokensPerUser) < 1) {
      return "Please provide amount of tokens per claim (one user)";
    }
    if (parseInt(formData.tokensPerUser) > parseInt(formData.tokensAmount)) {
      return "Please provide correct amount for token distribution";
    }
    if (BigNumber.from(myBalance).lt(BigNumber.from(convertToEther(formData.tokensAmount)))) {
      return "Not enough tokens balance in your wallet";
    }
    return false;
  }

  const totalUsersClaim = () => {
    const tokensPerUser = parseInt(formData.tokensPerUser || "0");
    const tokensAmount = parseInt(formData.tokensAmount || "0");
    if (tokensPerUser > 0) {
      return parseInt(tokensAmount / tokensPerUser);
    }
    return 0;
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
              <div className="flex-1">
                <Input type="number"
                       label={`${tokenSymbol} per user*`}
                       className="flex-1"
                       required={true}
                       maxLength={50}
                       value={formData.tokensPerUser}
                       onChange={(e) => setFormData({ ...formData, tokensPerUser: e.target.value })}
                />
              </div>
              <div className={`flex-1  ${totalUsersClaim() > 100000 ? "" : "pt-2"} text-sm`}>
                <b>Total Users:</b> {totalUsersClaim()}
              </div>
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

            <div className="mb-1 block text-left font-semibold mt-2 border-t pt-4">
              Proof of Personhood by World ID
            </div>
            <div className="bg-yellow-50 text-sm font-medium pl-2 pr-6 py-2 rounded-md border border-orange-200">
              <div className={"flex justify-between"}>
                <Checkbox label="Limit: 1 claim/person"
                          color="amber"
                          onChange={() => setIsLimit(!isLimit)}
                          className="font-semibold bg-white"/>
                <a href="https://worldcoin.org/"
                   className="underline pt-3 text-blue-500"
                   target="_blank">
                  read more
                </a>
              </div>
              {isLimit && (
                <div className={"ml-3 mb-2"}>
                  <Input type="text"
                         label="Action Id*"
                         required={true}
                         value={formData.actionId}
                         onChange={(e) => setFormData({ ...formData, actionId: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="mb-1 block text-left font-semibold mt-4">
              Allow Token streaming
            </div>
            <div className="bg-yellow-50 text-sm font-medium pl-2 pr-6 py-2 rounded-md border border-orange-200">
              <div className={"flex justify-between"}>
                <Checkbox label="Stream by Superfluid"
                          color="amber"
                          onChange={() => alert('coming soon')}
                          className="font-semibold bg-white"/>
                <a href="https://superfluid.finance/"
                   className="underline pt-3 text-blue-500"
                   target="_blank">
                  read more
                </a>
              </div>
            </div>
          </div>

          <div className="w-2/3">
            <div className="mb-1 block text-left font-semibold">
              Choose Distribution Strategy
            </div>
            <div>
              {distributionCampaignsFT.map(campaign => (
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
              <div className="text-gray-500 text-sm pt-2"/>
              <Button type="Submit" variant="gradient">
                Create Campaign
                <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
              </Button>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
              <div className={"w-12 mx-auto mt-10"}>
                <Loader/>
              </div>
            </div>
          )}
        </form>
      </Popup>
    </>
  );
}
