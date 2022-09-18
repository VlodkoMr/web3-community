import React, { useEffect, useState } from "react";
import { resizeFileImage, uploadNFTtoIPFS } from '../../../utils/media';
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { MdKeyboardArrowRight, MdOutlineAddCircleOutline, MdOutlineCancel } from 'react-icons/md';
import { convertToEther } from '../../../utils/format';
import { getTokenName } from '../../../utils/settings';
import { Loader } from '../../Loader';
import { Button, Dialog, DialogBody, DialogHeader, Textarea, Input } from '@material-tailwind/react';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';
import { Popup } from '../../Popup';
import { BsArrowRightShort } from 'react-icons/bs';
import { MdKeyboardArrowLeft } from 'react-icons/all';

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
  const { config: configUpload, error: errorUpload } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: submitFormData?.jsonFileURL?.length > 0,
    functionName: 'newCollectionItem',
    args: [submitFormData.jsonFileURL, submitFormData.mediaURL, submitFormData.name, submitFormData.price, submitFormData.supply, [
      submitFormData.royaltyAddress,
      submitFormData.royaltyPct,
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

  // call contract write when all is ready
  useEffect(() => {
    // submit data if we receive json result URL
    if (uploadWrite && submitFormData?.jsonFileURL.length > 0) {
      uploadWrite();
    }
  }, [uploadWrite]);

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
      <Popup title="Create NFT Series"
             isVisible={popupVisible}
             setIsVisible={setPopupVisible}>
        <form className="flex flex-col gap-4 relative" onSubmit={handleCreateNFT}>
          {currentStep === 1 ? (
            <div>
              <div className="mb-3">
                <Input type="text"
                       label="Title*"
                       required={true}
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-3 hidden-file-input">
                <Input type="file"
                       accept="image/*"
                       label="Media File*"
                       required={true}
                       className="h-[47px]"
                       onChange={(e) => resizeImage(e)}
                />
              </div>

              <div className="flex gap-6 mt-10">
                <div className="flex-1">
                  <Input type="number"
                         label={`Price, ${getTokenName(chain)}`}
                         required={true}
                         min={0}
                         step={0.001}
                         value={formData.price}
                         onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <small>*set zero to enable free mint</small>
                </div>
                <div className="flex-1">
                  <Input type="number"
                         label={`Max Supply`}
                         required={true}
                         min={0}
                         max={1000000000}
                         value={formData.supply}
                         onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                  />
                  <small>*set zero for unlimited supply</small>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <div className="text-gray-500 text-sm pt-3 font-medium">
                  Step 1/2
                </div>
                <Button type="Button"
                        variant="gradient"
                        onClick={handleNextStep}>
                  Next Step
                  <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-3">
                <Textarea label="Description"
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          value={formData.description}
                />
              </div>

              {parseFloat(formData.price) > 0 && (
                <div className="mb-3">
                  <div className="mb-1 block text-left text-gray-800 font-semibold">
                    Royalty
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-auto">
                      <Input type="text"
                             label="Wallet Address"
                             value={formData.royaltyAddress}
                             onChange={(e) => setFormData({ ...formData, royaltyAddress: e.target.value })}
                      />
                    </div>
                    <div className="w-1/4">
                      <Input type="number"
                             label="Percentage"
                             min={0}
                             value={formData.royaltyPct}
                             onChange={(e) => setFormData({ ...formData, royaltyPct: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3 mt-6">
                <div className="mb-1 block text-left text-gray-800 font-semibold">
                  Attributes
                  <MdOutlineAddCircleOutline
                    onClick={() => addNFTAttribute()}
                    className="inline-block w-5 h-5 ml-2 cursor-pointer opacity-80 hover:opacity-100"
                  />
                </div>
                <div className="px-6 py-3 border bg-gray-100 rounded-lg">
                  {formData.attributes.length > 0 ? (<>
                    {formData.attributes.map((attr, index) => (
                      <div className="flex flex-auto gap-2 mb-1 mt-1" key={index}>
                        <div className="flex-1">
                          <Input type="text"
                                 label="Type"
                                 name="type"
                                 value={attr.type}
                                 onChange={(e) => updateAttribute(index, e)}
                          />
                        </div>
                        <div className="flex-1">
                          <Input type="text"
                                 label="Value"
                                 name="value"
                                 value={attr.value}
                                 onChange={(e) => updateAttribute(index, e)}
                          />
                        </div>
                        <div className="w-5">
                          <MdOutlineCancel
                            onClick={() => removeAttribute(index)}
                            className="w-5 h-5 mt-3 text-red-500 hover:text-red-600 cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </>) : (
                    <small className="text-center flex-auto">
                      *No Attributes
                    </small>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button type="Button" size="sm" color="gray" variant="outlined" onClick={() => setCurrentStep(1)}>
                  <MdKeyboardArrowLeft className="text-lg align-bottom mr-1 inline-block" />
                  Back
                </Button>
                <Button type="Submit">
                  Create Series
                  <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block" />
                </Button>
              </div>
            </div>
          )}

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
