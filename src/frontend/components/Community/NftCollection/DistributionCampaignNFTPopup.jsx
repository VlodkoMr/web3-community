import React, { useEffect, useState } from "react";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { distributionCampaignsNFT } from '../../../utils/settings';
import { Loader } from '../../Loader';
import { Checkbox, Textarea, Input, Radio, Button } from '@material-tailwind/react';
import { Popup } from '../../Popup';
import { MdKeyboardArrowRight } from 'react-icons/md';

export function DistributionCampaignNFTPopup({
  popupVisible,
  setPopupVisible,
  handleSuccess,
  currentCommunity,
  collection
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [submitFormData, setSubmitFormData] = useState({});
  const [formData, setFormData] = useState({
    distributionType: "",
    dateFrom: "",
    dateTo: "",
    whitelisted: "",
    isLimit: false
  });

  const { config: configCreate, error: errorCreate } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: submitFormData?.distributionType > 0,
    functionName: 'createDistributionCampaign',
    args: [collection?.id, submitFormData.distributionType, submitFormData.dateFrom, submitFormData.dateTo, submitFormData.whitelisted || [], submitFormData.isLimit]
  });

  const { data: createData, write: createWrite, status: createStatus } = useContractWrite({
    ...configCreate,
    onSuccess: ({ hash }) => {
      setPopupVisible(false);

      dispatch(addTransaction({
        hash: hash,
        description: `Create Distribution Campaign`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setSubmitFormData({});
      setIsLoading(false);
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

    setSubmitFormData({
      distributionType,
      dateFrom,
      dateTo,
      whitelisted: whitelisted,
      isLimit: formData.isLimit
    });
  }

  // call contract write when all is ready
  useEffect(() => {
    if (createWrite && createStatus !== 'loading') {
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
      isLimit: false
    });
  }

  useEffect(() => {
    if (errorCreate) {
      console.log('errorCreate', errorCreate);
    }
  }, [errorCreate]);

  useEffect(() => {
    if (!popupVisible) {
      resetForm();
      setIsLoading(false);
    }
  }, [popupVisible]);

  const isFormErrors = () => {
    if (!parseInt(formData.distributionType)) {
      return "Select campaign Distribution Strategy";
    }
    return false;
  }

  return (
    <>
      {collection && (
        <Popup title="Create Distribution Campaign"
               isVisible={popupVisible}
               size={"lg"}
               setIsVisible={setPopupVisible}>
          <form className="flex flex-row gap-8 relative" onSubmit={handleCreateCampaign}>
            <div className="w-1/3">
              <img className="mt-2 h-48 w-48 bg-gray-50 rounded-lg object-cover mx-auto"
                   src={collection.mediaUri}
                   alt="" />

              <hr className="mt-6 mb-6" />

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

              <div className="mb-1 block text-left font-semibold mt-4">
                Proof of Personhood by World ID
              </div>
              <div className="flex justify-between bg-yellow-50 text-sm font-medium pl-2 pr-6 py-2 rounded-md
              border border-orange-200">
                <Checkbox label="Limit: 1 NFT/person"
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
                {distributionCampaignsNFT.map(campaign => (
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

            {isLoading && (
              <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
                <div className={"w-12 mx-auto mt-10"}>
                  <Loader />
                </div>
              </div>
            )}
          </form>
        </Popup>
      )}
    </>
  );
}
