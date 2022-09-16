import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Modal, FileInput, Spinner, Textarea } from 'flowbite-react';
import { resizeFileImage, uploadNFTtoIPFS } from '../../../utils/media';
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { MdOutlineCancel } from 'react-icons/md';
import { convertToEther } from '../../../utils/format';
import { getTokenName } from '../../../utils/settings';

export function CreateNFTSeriesPopup({ popupVisible, setPopupVisible, handleSuccess }) {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const currentCommunity = useSelector(state => state.community.current);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    supply: "",
    media: "",
    mediaURL: "",
    jsonFileURL: "",
    royaltyAddress: "",
    royaltyPct: "",
    attributes: []
  });

  const [submitFormData, setSubmitFormData] = useState({});
  const [debouncedFormData] = useDebounce(submitFormData, 300);
  const { config: configUpload, error: errorUpload } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: debouncedFormData?.jsonFileURL?.length > 0,
    functionName: 'newCollectionItem',
    args: [debouncedFormData.jsonFileURL, debouncedFormData.mediaURL, debouncedFormData.name, debouncedFormData.price, debouncedFormData.supply, [
      debouncedFormData.royaltyAddress,
      debouncedFormData.royaltyPct,
    ]]
  });

  const { data: uploadData, write: uploadWrite } = useContractWrite({
    ...configUpload,
    onSuccess: ({ hash }) => {
      setPopupVisible(false);
      setIsSubmitLoading(false);
      resetForm();

      dispatch(addTransaction({
        hash: hash,
        description: `Create NFT Series`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setIsSubmitLoading(false);
    },
  });

  useWaitForTransaction({
    hash: uploadData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        handleSuccess?.();
      }
    },
  });

  const handleCreateNFT = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsSubmitLoading(true);
    uploadNFTtoIPFS(formData).then((metadata) => {
      const royaltyAddress = formData.royaltyAddress.length > 1 ? formData.royaltyAddress : "0x0000000000000000000000000000000000000000";
      const royaltyPct = parseInt(formData.royaltyPct) > 0 ? parseInt(formData.royaltyPct) : 0;
      const price = convertToEther(formData.price);

      setSubmitFormData({
        ...formData,
        mediaURL: metadata.data.image.pathname.replace('//', ''),
        jsonFileURL: metadata.url,
        price,
        royaltyAddress,
        royaltyPct,
      });
    }).catch(e => {
      alert(e);
      setIsSubmitLoading(false);
    });
  }

  const resetForm = () => {
    setSubmitFormData({});
    setFormData({
      name: "",
      description: "",
      price: "",
      supply: "",
      media: "",
      mediaURL: "",
      jsonFileURL: "",
      royaltyAddress: "",
      royaltyPct: "",
      attributes: []
    });
    setCurrentStep(1);
  }

  useEffect(() => {
    if (errorUpload) {
      console.log('errorUpload', errorUpload);
    }
  }, [errorUpload]);

  useEffect(() => {
    // submit data if we receive json result URL
    if (uploadWrite && submitFormData?.jsonFileURL.length > 0) {
      uploadWrite();
    }
  }, [uploadWrite]);

  // useEffect(() => {
  //   setIsFormDataValid(!isFormErrors());
  // }, [formData]);

  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "NFT Title should be longer than 3 chars";
    }
    if (!formData.media || !formData.media.size) {
      return "No media, please select media file and wait till upload";
    }
    if (!formData.price.length) {
      return "Please provide price or set 0 for free mint";
    }
    if (!formData.supply.length) {
      return "Please provide supply or set 0 for unlimited supply";
    }

    if (formData.royaltyAddress.length > 0) {
      if (parseInt(formData.royaltyPct) <= 0) {
        return "Please provide royalty percent";
      }
      if (parseInt(formData.royaltyPct) > 90) {
        return "Royalty percent can't be more than 90%";
      }
    }
    return false;
  }

  const resizeImage = (e) => {
    const image = e.target.files[0];
    resizeFileImage(image, 1280, 1280).then(result => {
      setFormData({ ...formData, media: result });
    });
  }

  const handleNextStep = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }
    setCurrentStep(2);
  }

  const removeAttribute = (index) => {
    const values = [...formData.attributes];
    values.splice(index, 1);
    setFormData({ ...formData, attributes: values })
  }

  const updateAttribute = (index, event) => {
    const values = [...formData.attributes];
    const updatedValue = event.target.name;
    values[index][updatedValue] = event.target.value;
    setFormData({ ...formData, attributes: values })
  }

  const addNFTAttribute = () => {
    const values = [...formData.attributes];
    values.push({ type: "", value: "" });
    setFormData({ ...formData, attributes: values })
  }

  return (
    <>
      <Modal
        popup={true}
        show={popupVisible}
        onClose={() => setPopupVisible(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-lg pb-4 mb-8 -mt-8 text-center w-full border-b text-gray-500 font-semibold">
            Create NFT Series
          </div>
          <form className="space-y-6 flex flex-col gap-4 relative px-6" onSubmit={handleCreateNFT}>
            {currentStep === 1 ? (
              <div>
                <div className="mb-3">
                  <div className="mb-1 block text-left">
                    <Label htmlFor="name" value={`Title`} />
                    <sup className={"text-red-400"}>*</sup>
                  </div>
                  <TextInput id="name"
                             type="text"
                             required={true}
                             value={formData.name}
                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <div className="mb-1 block text-left">
                    <Label htmlFor="media" value="Media File" />
                  </div>
                  <FileInput id="media"
                             accept="image/*"
                             onChange={(e) => resizeImage(e)}
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="mb-1 block text-left">
                      <Label htmlFor="price" value={`Price (${getTokenName(chain)})`} />
                      <sup className={"text-red-400"}>*</sup>
                    </div>
                    <TextInput id="price"
                               type="number"
                               min={0}
                               step={0.001}
                               required={true}
                               helperText="*set zero to enable free mint"
                               value={formData.price}
                               onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 block text-left">
                      <Label htmlFor="supply" value="Max Supply" />
                      <sup className={"text-red-400"}>*</sup>
                    </div>
                    <TextInput id="supply"
                               type="number"
                               min={0}
                               max={1000000000}
                               required={true}
                               helperText="*set zero for unlimited supply"
                               value={formData.supply}
                               onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-5 border-t">
                  <div className="text-gray-500 text-sm pt-2">
                    Step 1/2
                  </div>
                  <Button type="Button"
                          gradientDuoTone="purpleToPink"
                          onClick={handleNextStep}>
                    <span className="uppercase">
                      Next Step &raquo;
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-3">
                  <div className="mb-1 block text-left">
                    <Label htmlFor="description" value={`Description`} />
                  </div>
                  <Textarea id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {parseFloat(formData.price) > 0 && (
                  <div className="mb-3">
                    <div className="mb-1 block text-left">
                      <Label value={`Royalty`} />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-auto">
                        <TextInput type="text"
                                   placeholder="Wallet Address"
                                   value={formData.royaltyAddress}
                                   onChange={(e) => setFormData({ ...formData, royaltyAddress: e.target.value })}
                        />
                      </div>
                      <div className="w-1/4">
                        <TextInput type="number"
                                   min={0}
                                   className="flex-1"
                                   placeholder="Percentage"
                                   value={formData.royaltyPct}
                                   onChange={(e) => setFormData({ ...formData, royaltyPct: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-3 mt-6 bg-gray-50 rounded-md px-8 pt-4 pb-3">
                  <div className="mb-1 block text-left flex justify-between">
                    <div className="pt-1">
                      <Label value={`Attributes`} />
                    </div>
                    <Button type="Button"
                            size="xs"
                            color="gray"
                            onClick={() => addNFTAttribute()}>
                      + Add Attribute
                    </Button>
                  </div>
                  {
                    formData.attributes.length > 0 && formData.attributes.map((attr, index) => (
                      <div className="flex gap-2 mb-2" key={index}>
                        <div className="w-5">
                          <MdOutlineCancel
                            onClick={() => removeAttribute(index)}
                            className="w-5 h-5 mt-3 text-red-500 hover:text-red-600 cursor-pointer" />
                        </div>
                        <div className="flex-1">
                          <TextInput type="text"
                                     placeholder="Type"
                                     name="type"
                                     value={attr.type}
                                     onChange={(event) => updateAttribute(index, event)}
                          />
                        </div>
                        <div className="flex-1">
                          <TextInput type="text"
                                     name="value"
                                     placeholder="Value"
                                     value={attr.value}
                                     onChange={(event) => updateAttribute(index, event)}
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>

                <div className="flex justify-between mt-8 pt-5 border-t">
                  <Button type="Button" size="sm" color="light" onClick={() => setCurrentStep(1)}>
                    <span className="uppercase">&laquo; Back</span>
                  </Button>
                  <Button type="Submit" gradientDuoTone="purpleToPink">
                    <span className="uppercase">Create Series &raquo;</span>
                  </Button>
                </div>
              </div>
            )}

            {isSubmitLoading && (
              <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
                <div className={"w-12 mx-auto mt-10"}>
                  <Spinner size={10} />
                </div>
              </div>
            )}
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
