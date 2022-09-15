import React, { memo, useEffect, useState } from "react";
import { Label, TextInput, Button, Modal, FileInput, Spinner, Textarea } from 'flowbite-react';
import { resizeFileImage, uploadMediaToIPFS } from '../../utils/media';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import NFTCollectionABI from '../../contractsData/NFTCollection.json';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { MdOutlineCancel } from 'react-icons/md';

export function CreateNFTPopup({ popupVisible, setPopupVisible, handleSuccess }) {
  const dispatch = useDispatch();
  const [isResizeLoading, setIsResizeLoading] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    supply: "",
    mediaURL: "",
    jsonFileURL: "",
  });
  const [formDataAttributes, setFormDataAttributes] = useState([]);
  const [debouncedFormData] = useDebounce(formData, 300);
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [debouncedFormDataValid] = useDebounce(isFormDataValid, 200);
  const currentCommunity = useSelector(state => state.community.current);

  const { config: configUpload, error: errorUpload } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: debouncedFormDataValid,
    functionName: 'newCollectionItem',
    args: [debouncedFormData.jsonFileURL, debouncedFormData.price, debouncedFormData.supply]
  });

  const { data: uploadData, write: uploadWrite } = useContractWrite({
    ...configUpload,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Create new NFT`
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
        setPopupVisible(false);
        setIsSubmitLoading(false);
        resetForm();
        handleSuccess?.();
      }
    },
  });


  const handleCreateNFT = (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    uploadWrite?.();
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      supply: "",
      mediaURL: "",
      jsonFileURL: "",
    });
  }

  useEffect(() => {
    console.log('errorUpload', errorUpload);
  }, [errorUpload]);

  useEffect(() => {
    setIsFormDataValid(!isFormErrors());
  }, [formData]);

  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "NFT Title should be longer than 3 chars";
    }
    if (!formData.mediaURL.length) {
      return "No media, please select media file and wait till upload";
    }
    if (!formData.price.length) {
      return "Please provide price or set 0 for free mint";
    }
    if (!formData.supply.length) {
      return "Please provide supply or set 0 for unlimited supply";
    }
    return false;
  }

  const resizeImage = (e) => {
    setIsResizeLoading(true);
    const image = e.target.files[0];
    resizeFileImage(image, 1280, 1280).then(result => {
      uploadMediaToIPFS(result).then(mediaURL => {
        console.log('mediaURL', mediaURL)
        setFormData({ ...formData, mediaURL: mediaURL });
        setIsResizeLoading(false);
      }).catch(e => {
        alert(e);
        setIsResizeLoading(false);
      });
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
    const values = [...formDataAttributes];
    values.splice(index, 1);
    setFormDataAttributes(values);
  }

  const updateAttribute = (index, event) => {
    const values = [...formDataAttributes];
    const updatedValue = event.target.name;
    values[index][updatedValue] = event.target.value;
    setFormDataAttributes(values);
  }

  const addNFTAttribute = () => {
    const values = [...formDataAttributes];
    values.push({ type: "", name: "" });
    setFormDataAttributes(values);
  }

  const NFTAttribute = memo(({ attr, index }) => (
    <div className="flex gap-2 mb-2">
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
                   name="name"
                   placeholder="Name"
                   value={attr.name}
                   onChange={(event) => updateAttribute(index, event)}
        />
      </div>
    </div>
  ));

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
            Create New NFT
          </div>
          <form className="space-y-6 flex flex-col gap-4 relative px-6" onSubmit={handleCreateNFT}>
            {currentStep === 1 ? (
              <div>
                <div className="mb-3">
                  <div className="mb-1 block text-left">
                    <Label htmlFor="name" value={`NFT Title`} />
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
                    <Label htmlFor="media" value="Select media file" />
                  </div>
                  <FileInput id="media"
                             accept="image/*"
                             onChange={(e) => resizeImage(e)}
                  />
                </div>

                <div className="flex gap-6">
                  <div className="flex-1">
                    <div className="mb-1 block text-left">
                      <Label htmlFor="price" value={`Price`} />
                      <sup className={"text-red-400"}>*</sup>
                    </div>
                    <TextInput id="price"
                               type="number"
                               min={0}
                               step={0.01}
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
                          onClick={handleNextStep}
                          disabled={isResizeLoading}>
                    <span className="uppercase">
                      Next Step &raquo;
                    </span>
                  </Button>
                </div>

                {isResizeLoading && (
                  <div className="bg-white/80 absolute top-0 bottom-0 right-0 left-0 z-10">
                    <div className={"w-12 mx-auto mt-10"}>
                      <Spinner size={10} />
                    </div>
                    <div className="text-gray-500 text-center mt-3">
                      Uploading media...
                    </div>
                  </div>
                )}

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

                <div className="mb-3">
                  <div className="mb-1 block text-left">
                    <Label htmlFor="external_url" value={`External URL`} />
                  </div>
                  <TextInput id="external_url"
                             type="text"
                             required={true}
                             value={formData.url}
                             onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

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
                    formDataAttributes.length > 0 && formDataAttributes.map((attr, index) => (
                      <NFTAttribute attr={attr} index={index} key={index} />
                    ))
                  }
                </div>

                <div className="flex justify-between mt-8 pt-5 border-t">
                  <Button type="Button" size="sm" color="light" onClick={() => setCurrentStep(1)}>
                    <span className="uppercase">&laquo; Back</span>
                  </Button>
                  <Button type="Submit" gradientDuoTone="purpleToPink">
                    <span className="uppercase">Create NFT &raquo;</span>
                  </Button>
                </div>
              </div>
            )}


            {isSubmitLoading && (
              <div className="bg-white/80 absolute top-0 bottom-0 right-0 left-0 z-10">
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
