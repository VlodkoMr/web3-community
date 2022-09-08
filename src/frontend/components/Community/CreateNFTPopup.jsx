import React, { useState } from "react";
import { Label, TextInput, Button, Modal, FileInput, Spinner } from 'flowbite-react';
import { resizeFileImage, uploadMediaToIPFS } from '../../utils/media';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';

export function CreateNFTPopup({ contract, popupVisible, setPopupVisible, handleSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    price: "",
    supply: "",
    media: ""
  });

  const handleCreateNFT = (e) => {
    e.preventDefault();

    if (formData.logo.length) {
      setIsLoading(true);
      uploadMediaToIPFS(formData.logo, formData.name).then(logoURL => {
        createCommunity(logoURL);
      }).catch(e => {
        alert(e);
        setIsLoading(false);
      })
    } else {
      createCommunity("");
    }
  }

  const resetForm = () => {
    setFormData({
      price: "",
      supply: "",
      media: ""
    });
  }

  const createCommunity = () => {
    if (contract) {
      setIsLoading(true);
      // contract.createCommunity(formData.name, formData.description, logoURL).then(tx => {
      //   dispatch(addTransaction({
      //     hash: tx.hash,
      //     description: `Create Community "${formData.name}"`
      //   }));
      //
      //   handleTxStart?.();
      //   tx.wait().then(receipt => {
      //     setIsLoading(false);
      //     if (receipt.status === 1) {
      //       handleSuccess();
      //       resetForm();
      //     } else {
      //       alert('Minting error');
      //     }
      //   });
      // }).catch(err => {
      //   console.log('tx canceled', err);
      //   setIsLoading(false);
      //   alert("Transaction error!");
      // });
    } else {
      alert("Please connect your wallet");
    }
  }

  const resizeImage = (e) => {
    const image = e.target.files[0];
    resizeFileImage(image, 1280, 1280).then(result => {
      setFormData({ ...formData, logo: result })
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
            <div>
              <div className="mb-1 block text-left">
                <Label htmlFor="media" value="Media" />
              </div>
              <FileInput id="media"
                         accept="image/*"
                         onChange={(e) => resizeImage(e)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="mb-1 block text-left">
                  <Label htmlFor="price" value="Price" />
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
              <Button type="Submit" gradientDuoTone="purpleToPink">
                <span className="uppercase">Create NFT</span>
                <img src={require("../../assets/images/home/arrow.svg")} alt="->" className={"w-4 h-2 ml-2"} />
              </Button>
            </div>

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
