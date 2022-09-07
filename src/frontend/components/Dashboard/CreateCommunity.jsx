import React, { useState } from "react";
import { Label, TextInput, Button, Textarea, FileInput } from 'flowbite-react';
import { resizeFileImage, uploadMediaToIPFS } from '../../utils/media';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';

export function CreateCommunity({ contract, handleSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: ""
  });

  const handleCreate = (e) => {
    e.preventDefault();

    if (formData.logo.length) {
      uploadMediaToIPFS(formData.logo, formData.name).then(logoURL => {
        createCommunity(logoURL);
      }).catch(e => {
        alert(e);
      })
    } else {
      createCommunity("");
    }
  }

  const createCommunity = (logoURL) => {
    if (contract) {
      contract.createCommunity(formData.name, logoURL).then(tx => {
        dispatch(addTransaction({
          hash: tx.hash,
          description: "Create New Community"
        }));

        tx.wait().then(receipt => {
          if (receipt.status === 1) {
            handleSuccess();
          } else {
            alert('Minting error');
          }
        });
      }).catch(err => {
        console.log('tx canceled', err)
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
      <form className="flex flex-col gap-4" onSubmit={handleCreate}>
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

        {/*<div className="flex items-center gap-2">*/}
        {/*  <Checkbox id="remember" />*/}
        {/*  <Label htmlFor="remember">*/}
        {/*    Remember me*/}
        {/*  </Label>*/}
        {/*</div>*/}

        <div className={"flex justify-end"}>
          <Button type="Submit" gradientDuoTone="purpleToPink">
            <span className="uppercase">Create</span>
            <img src={require("../../assets/images/home/arrow.svg")} alt="->" className={"w-4 h-2 ml-2"} />
          </Button>
        </div>
      </form>

    </>
  );
}
