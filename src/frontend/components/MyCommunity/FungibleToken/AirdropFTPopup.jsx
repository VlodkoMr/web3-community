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
    whitelisted: "",
    tokensAmount: "",
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

  // const totalUsersClaim = () => {
  //   const tokensPerUser = parseInt(formData.tokensPerUser || "0");
  //   const tokensAmount = parseInt(formData.tokensAmount || "0");
  //   if (tokensPerUser > 0) {
  //     return parseInt(tokensAmount / tokensPerUser);
  //   }
  //   return 0;
  // }

  const addressCount = () => {
    let count = 0;
    formData.whitelisted.replace("\n", ",").split(",").map(address => {
      if (address.length > 3) {
        count++;
      }
    });
    return count;
  }

  const tokensPerUser = () => {
    const totalTokens = parseInt(formData.tokensAmount);
    const count = addressCount();
    if (count > 0) {
      return parseInt(totalTokens / count);
    }
    return 0;
  }

  const handleSendAirdrop = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <Popup title="New Token Airdrop"
             isVisible={popupVisible}
             size={"lg"}
             setIsVisible={setPopupVisible}>
        <form className="flex flex-row gap-10 relative" onSubmit={handleSendAirdrop}>
          <div className="w-1/3">
            <div className={"mt-4"}>
              <Input type="number"
                     label={`Total ${tokenSymbol} Amount*`}
                     className="flex-1"
                     required={true}
                     maxLength={50}
                     value={formData.tokensAmount}
                     onChange={(e) => setFormData({ ...formData, tokensAmount: e.target.value })}
              />
            </div>
            <div className="mt-8">
              Total Addresses: <b>{addressCount()}</b>
            </div>
            <div className="mt-1">
              Tokens per address: <b>{tokensPerUser()} {tokenSymbol}</b>
            </div>
          </div>

          <div className={"w-2/3 text-sm"}>
            <Textarea label="List of Wallet addresses:"
                      variant={"static"}
                      className={"h-48 bg-gray-50 p-6 mt-4"}
                      placeholder="Wallet addresses separated by coma"
                      onChange={(e) => setFormData({ ...formData, whitelisted: e.target.value })}
                      value={formData.whitelisted}
            />
            <div className={"flex justify-end mt-4"}>
              <Button type="Submit" variant="gradient">
                Send Airdrop
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
