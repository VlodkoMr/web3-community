import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Modal, FileInput, Spinner } from 'flowbite-react';
import { resizeFileImage, uploadMediaToIPFS } from '../../utils/media';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import NFTCollectionABI from '../../contractsData/NFTCollection.json';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';

export function CreateNFTPopup({ popupVisible, setPopupVisible, handleSuccess }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    supply: "",
    media: "",
    mediaData: "",
  });
  const [debouncedFormData] = useDebounce(formData, 300);
  const [isFormDataValid, setIsFormDataValid] = useState(false);
  const [debouncedFormDataValid] = useDebounce(isFormDataValid, 200);

  const currentCommunity = useSelector(state => state.community.current);

  const { config: configUpload, error: errorUpload } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: debouncedFormDataValid,
    functionName: 'newCollectionItem',
    args: [debouncedFormData.media, debouncedFormData.price, debouncedFormData.supply]
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
      setIsLoading(false);
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
        setIsLoading(false);
        resetForm();
        handleSuccess?.();
      }
    },
  });


  const handleCreateNFT = (e) => {
    e.preventDefault();
    setIsLoading(true);
    uploadWrite?.();
  }

  const resetForm = () => {
    setFormData({
      price: "",
      supply: "",
      media: "",
      mediaData: "",
    });
  }

  useEffect(() => {
    console.log('errorUpload', errorUpload);
  }, [errorUpload]);

  useEffect(() => {
    setIsFormDataValid(!isFormErrors());
  }, [formData]);

  const isFormErrors = () => {
    if (!formData.media.length) {
      return "Error: No media";
    }
    return false;
  }

  const resizeImage = (e) => {
    const image = e.target.files[0];
    resizeFileImage(image, 1280, 1280).then(result => {
      // setFormData({ ...formData, mediaData: result });

      uploadMediaToIPFS(result).then(mediaURL => {
        console.log('mediaURL', mediaURL)
        setFormData({ ...formData, media: mediaURL });
      });
    });
  }

  return (
    <>
      <Modal
        show={popupVisible}
        onClose={() => setPopupVisible(false)}
      >
        <Modal.Header>Create New NFT</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4 relative px-6" onSubmit={handleCreateNFT}>
            {!formData.media ? (
              <div>
                <div className="mb-4 text-center">
                  Step 1/2
                </div>
                <div className="mb-1 block text-left">
                  <Label htmlFor="media" value="Select media file" />
                </div>
                <FileInput id="media"
                           accept="image/*"
                           onChange={(e) => resizeImage(e)}
                />
              </div>
            ) : (
              <div>
                <div className="mb-4 text-center">
                  Step 2/2
                </div>
                <div className="flex gap-4">
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
                               helperText="set zero to enable free mint"
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
                               helperText="set zero for unlimited supply"
                               value={formData.supply}
                               onChange={(e) => setFormData({ ...formData, supply: e.target.value })}
                    />
                  </div>
                </div>

                <div className={"flex justify-end"}>
                  <Button type="Submit" gradientDuoTone="purpleToPink" disabled={!debouncedFormDataValid}>
                    <span className="uppercase">Create NFT</span>
                    <img src={require("../../assets/images/home/arrow.svg")} alt="->" className={"w-4 h-2 ml-2"} />
                  </Button>
                </div>
              </div>
            )}

            {isLoading && (
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
