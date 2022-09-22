import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Checkbox, Textarea, Input, Radio, Button } from '@material-tailwind/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Loader } from '../../Loader';
import { Popup } from '../../Popup';

export function AirdropFTPopup(
  {
    popupVisible,
    setPopupVisible,
    handleSuccess,
    currentCommunity,
    tokenSymbol,
    myBalance,
  }) {
  const dispatch = useDispatch();
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

  // const { config: configApprove, error: errorApprove } = usePrepareContractWrite({
  //   addressOrName: currentCommunity?.ftContract,
  //   contractInterface: FungibleTokenABI.abi,
  //   enabled: approveFormData?.distributionType > 0 && approveFormData.tokensAmount > 0,
  //   functionName: 'approve',
  //   args: [ currentCommunity?.ftContract, approveFormData.tokensAmount ]
  // });
  //
  // const { data: approveData, write: approveWrite, status: approveStatus } = useContractWrite({
  //   ...configApprove,
  //   onSuccess: ({ hash }) => {
  //     dispatch(addTransaction({
  //       hash: hash,
  //       description: `Approve token transfer`
  //     }));
  //   },
  //   onError: ({ message }) => {
  //     setIsLoading(false);
  //     setApproveFormData({});
  //     console.log('onError message', message);
  //   },
  // });
  //
  // useWaitForTransaction({
  //   hash: approveData?.hash,
  //   onError: error => {
  //     setIsLoading(false);
  //     setApproveFormData({});
  //     console.log('is err', error);
  //   },
  //   onSuccess: data => {
  //     if (data) {
  //       setSubmitFormData({ ...approveFormData });
  //       setApproveFormData({});
  //     }
  //   },
  // });
  //
  // // call contract write when all is ready
  // useEffect(() => {
  //   if (approveWrite && approveStatus !== 'loading') {
  //     approveWrite();
  //   }
  // }, [ approveWrite ]);

  // ------------ Create Distribution Campaign ------------

  // const { config: configCreate, error: errorCreate } = usePrepareContractWrite({
  //   addressOrName: currentCommunity?.ftContract,
  //   contractInterface: FungibleTokenABI.abi,
  //   enabled: submitFormData?.distributionType > 0 && submitFormData?.tokensAmount > 0,
  //   functionName: 'createDistributionCampaign',
  //   args: [
  //     submitFormData.distributionType, submitFormData.dateFrom, submitFormData.dateTo, submitFormData.whitelisted || [],
  //     submitFormData.actionId, submitFormData.tokensAmount, submitFormData.tokensPerUser
  //   ]
  // });
  //
  // const { data: createData, write: createWrite, status: createStatus } = useContractWrite({
  //   ...configCreate,
  //   onSuccess: ({ hash }) => {
  //     setPopupVisible(false);
  //     setSubmitFormData({});
  //     resetForm();
  //
  //     dispatch(addTransaction({
  //       hash: hash,
  //       description: `Create Distribution Campaign`
  //     }));
  //   },
  //   onError: ({ message }) => {
  //     setIsLoading(false);
  //     setSubmitFormData({});
  //     console.log('onError message', message);
  //   },
  // });
  //
  // useWaitForTransaction({
  //   hash: createData?.hash,
  //   onError: error => {
  //     console.log('is err', error);
  //     setIsLoading(false);
  //     setSubmitFormData({});
  //   },
  //   onSuccess: data => {
  //     setIsLoading(false);
  //     if (data) {
  //       handleSuccess?.();
  //     }
  //   },
  // });
  //
  // useEffect(() => {
  //   if (createWrite && createStatus !== 'loading') {
  //     createWrite();
  //   }
  // }, [ createWrite ]);

  // ------------ Actions ------------

  const handleSendAirdrop = () => {

  }

  return (
    <>
      <Popup title="Create Distribution Campaign"
             isVisible={popupVisible}
             size={"lg"}
             setIsVisible={setPopupVisible}>
        <form className="flex flex-row gap-8 relative" onSubmit={handleSendAirdrop}>
          <div className="w-1/3">
            <div className="mb-1 block text-left font-semibold">
              New Token Airdrop
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
              {/*<div className={`flex-1  ${totalUsersClaim() > 100000 ? "" : "pt-2"} text-sm`}>*/}
              {/*  <b>Total Users:</b> {totalUsersClaim()}*/}
              {/*</div>*/}
            </div>

            <div className={"text-sm mt-6"}>
              <Textarea label="List of Addresses:"
                        variant={"static"}
                        placeholder="Wallet addresses separated by coma"
                        onChange={(e) => setFormData({ ...formData, whitelisted: e.target.value })}
                        value={formData.whitelisted}
              />
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
