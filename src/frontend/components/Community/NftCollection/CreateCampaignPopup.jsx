import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Modal, Spinner, Radio, Textarea } from 'flowbite-react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';

export function CreateCampaignPopup({ popupVisible, setPopupVisible, handleSuccess, currentCommunity, collection }) {
  const dispatch = useDispatch();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    distribution_type: "",
    date_from: "",
    date_to: "",
    whitelisted: ""
  });

  const [debouncedFormData] = useDebounce(formData, 300);
  const { config: configCreate, error: errorCreate } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: debouncedFormData.distribution_type.length > 0,
    functionName: 'createCampaign',
    args: [collection?.id, debouncedFormData.distribution_type, debouncedFormData.date_from, debouncedFormData.date_to, debouncedFormData.whitelisted]
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

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsSubmitLoading(true);
    createWrite();
  }

  const resetForm = () => {
    setFormData({
      distribution_type: "",
      date_from: "",
      date_to: "",
      whitelisted: "",
    });
  }

  const DistributionStrategy = ({ value, title, description, isAvailable }) => (
    <label className={`block bg-gray-100 mb-1 px-4 py-2 border border-transparent hover:border-gray-200 
    rounded-lg cursor-pointer ${isAvailable ? "" : "opacity-60"}`}>
      <h4>
        <Radio id="type"
               name="type"
               value={value}
               disabled={!isAvailable}
               checked={value === formData.distribution_type}
               onChange={() => setFormData({ ...formData, distribution_type: value })}
        />
        <span className="ml-2 text-lg text-gray-800 font-semibold">{title}</span>
      </h4>
      <p className="text-sm ml-6 text-gray-500">{description}</p>
      {value === "4" && formData.distribution_type === value && (
        <div className={"text-sm mt-3 ml-6"}>
          <Textarea id="description"
                    placeholder={"Wallet addresses separated by coma"}
                    value={formData.whitelisted}
                    onChange={(e) => setFormData({ ...formData, whitelisted: e.target.value })}
          />
        </div>
      )}
    </label>
  )

  useEffect(() => {
    if (errorCreate) {
      console.log('errorCreate', errorCreate);
    }
  }, [errorCreate]);

  const isFormErrors = () => {
    if (!parseInt(formData.distribution_type)) {
      return "Select Campaign Distribution type";
    }
    return false;
  }

  return (
    <>
      <Modal
        popup={true}
        show={popupVisible}
        size={"4xl"}
        onClose={() => setPopupVisible(false)}
      >
        <Modal.Header />
        {collection && (
          <Modal.Body>
            <div className="text-lg pb-4 mb-8 -mt-8 text-center w-full border-b text-gray-500 font-semibold">
              Create Distribution Campaign
            </div>

            <form className="flex flex-row px-4 gap-8 relative" onSubmit={handleCreateCampaign}>
              <div className="w-48">
                <img className="mt-2 h-48 w-48 bg-gray-50 rounded-lg object-cover" src={collection.mediaUri} alt="" />
                <hr className="mt-6 mb-4" />
                <div className="mb-3">
                  <Label htmlFor="name" value={`Start Date`} />
                  <TextInput id="account"
                             type="date"
                             required={true}
                             value={formData.date_from}
                             onChange={(e) => setFormData({ ...formData, date_from: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="name" value={`End Date`} />
                  <TextInput id="account"
                             type="date"
                             required={true}
                             value={formData.date_to}
                             onChange={(e) => setFormData({ ...formData, date_to: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-1 block text-left">
                  <Label htmlFor="name" value={`Choose Distribution Strategy`} />
                </div>
                <div>
                  <DistributionStrategy value={"1"}
                                        title="Direct link - Public Access"
                                        description="Get public page URL and share this link with your audience.
                                        All users will be able to mint NFT on this page."
                                        isAvailable={true} />
                  <DistributionStrategy value={"2"}
                                        title="Direct link - Whitelisted Only"
                                        description="Get public page URL and share this link to whitelisted wallet addresses.
                                        Only whitelisted users will be able to mint NFT on this page."
                                        isAvailable={true} />
                  <DistributionStrategy value={"3"}
                                        title="Email Verification"
                                        description="Get public page URL and share this link with your audience.
                                        User should confirm email to mint NFT."
                                        isAvailable={true} />
                  <DistributionStrategy value={"4"}
                                        title="Event"
                                        description="You will receive unique 6 digits code that is required to mint NFT.
                                        Can be used to limit access on local or online events."
                                        isAvailable={true} />
                  <DistributionStrategy value={"5"}
                                        title="Credit Card"
                                        description="(coming soon)"
                                        isAvailable={false} />
                </div>

                <div className="flex justify-between mt-8 pt-5 border-t">
                  <div className="text-gray-500 text-sm pt-2" />
                  <Button type="Submit"
                          disabled={!createWrite}
                          gradientDuoTone="purpleToPink">
                    <span className="uppercase">
                      Create Campaign &raquo;
                    </span>
                  </Button>
                </div>
              </div>

              {isSubmitLoading && (
                <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
                  <div className={"w-12 mx-auto mt-10"}>
                    <Spinner size={10} />
                  </div>
                </div>
              )}
            </form>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}
