import React, { useState } from "react";
import { Label, TextInput, Button, Textarea, FileInput, Spinner } from 'flowbite-react';
import { resizeFileImage, uploadMediaToIPFS } from '../../utils/media';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';

export function EditCommunity({ contract, handleSuccess, handleTxStart, editCommunity }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editCommunity?.name || "",
    logo: "",
    description: editCommunity?.description || ""
  });

  const handleSave = (e) => {
    e.preventDefault();

    if (formData.logo.length) {
      setIsLoading(true);
      uploadMediaToIPFS(formData.logo, formData.name).then(logoURL => {
        saveCommunity(logoURL);
      }).catch(e => {
        alert(e);
        setIsLoading(false);
      })
    } else {
      saveCommunity("");
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      description: ""
    });
  }

  const saveCommunity = (logoURL) => {
    if (contract) {
      setIsLoading(true);

      const saveMethod = editCommunity ? "editCommunity" : "createCommunity";

      contract[saveMethod](formData.name, formData.description, logoURL).then(tx => {
        dispatch(addTransaction({
          hash: tx.hash,
          description: `${editCommunity ? "Save" : "Create"} Community "${formData.name}"`
        }));

        handleTxStart?.();
        tx.wait().then(receipt => {
          setIsLoading(false);
          if (receipt.status === 1) {
            handleSuccess();
            resetForm();
          } else {
            alert('Minting error');
          }
        });
      }).catch(err => {
        console.log('tx canceled', err);
        setIsLoading(false);
        alert("Transaction error!");
      });
    } else {
      alert("Please connect your wallet");
    }
  }

  const resizeImage = (e) => {
    const image = e.target.files[0];
    resizeFileImage(image, 256, 256).then(result => {
      setFormData({ ...formData, logo: result })
    });
  }

  return (
    <>
      <form className="flex flex-col gap-4 relative" onSubmit={handleSave}>
        <div>
          <div className="mb-1 block text-left">
            <Label htmlFor="name" value="Community Title" />
            <sup className={"text-red-400"}>*</sup>
          </div>
          <TextInput id="name"
                     type="text"
                     required={true}
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <div className="mb-1 block text-left">
            <Label htmlFor="logo" value="Logo" />
          </div>
          <FileInput id="logo"
                     accept="image/*"
                     onChange={(e) => resizeImage(e)}
          />
        </div>
        <div>
          <div className="mb-1 block text-left">
            <Label htmlFor="description" value="Description" />
          </div>
          <Textarea id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className={"flex justify-end"}>
          <Button type="Submit" gradientDuoTone="purpleToPink">
            <span className="uppercase">{editCommunity ? "Save" : "Create"}</span>
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
    </>
  );
}
