import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Modal, Spinner } from 'flowbite-react';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';

export function CreateCampaignPopup({ popupVisible, setPopupVisible, handleSuccess, currentCommunity, collection }) {
  const dispatch = useDispatch();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    date_from: "",
    date_to: "",
  });

  const [debouncedFormData] = useDebounce(formData, 300);
  const { config: configCreate, error: errorCreate } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: debouncedFormData.type.length > 0,
    functionName: 'createCampaign',
    args: [collection?.id, formData.type, formData.date_from, formData.date_to]
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
      type: "",
      date_from: "",
      date_to: "",
    });
  }

  useEffect(() => {
    if (errorCreate) {
      console.log('errorCreate', errorCreate);
    }
  }, [errorCreate]);

  const isFormErrors = () => {
    if (!parseInt(formData.type)) {
      return "Select Campaign Distribution type";
    }
    return false;
  }

  return (
    <>
      <Modal
        popup={true}
        show={popupVisible}
        onClose={() => setPopupVisible(false)}
      >
        <Modal.Header />
        {collection && (
          <Modal.Body>
            <div className="text-lg pb-4 mb-8 -mt-8 text-center w-full border-b text-gray-500 font-semibold">
              Create Distribution Campaign
            </div>

            <form className="flex flex-row px-4 gap-8 relative" onSubmit={handleCreateCampaign}>
              <div className="w-36">
                <img className="mt-2 h-36 w-36 bg-gray-50 rounded-lg object-cover" src={collection.mediaUri} alt="" />
              </div>
              <div className="flex-1">
                <div>
                  ...
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
