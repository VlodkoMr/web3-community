import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Textarea, FileInput, Spinner } from 'flowbite-react';
import { resizeFileImage, uploadMediaToIPFS } from '../../utils/media';
import { useDispatch } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { addTransaction } from '../../store/transactionSlice';
import { communityTypes } from '../../utils/settings';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { mainContract } from '../../utils/requests';

export function EditCommunity({ handleSuccess, handleTxStart, editCommunity }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: editCommunity?.name || "",
    category: editCommunity?.category || "",
    privacy: editCommunity?.privacy || "0",
    logo: editCommunity?.logo || "",
    logoURL: "",
    description: editCommunity?.description || ""
  });
  const [debouncedFormData] = useDebounce(formData, 500);
  const [isFormDataValid, setIsFormDataValid] = useState(false);

  // ------------- Create Community Methods -------------

  const { config: configAdd, error: errorAdd } = usePrepareContractWrite({
    ...mainContract,
    enabled: isFormDataValid,
    functionName: 'createCommunity',
    args: [debouncedFormData.name, debouncedFormData.category, debouncedFormData.privacy, debouncedFormData.description, debouncedFormData.logoURL]
  });

  const { data: addCommunityData, write: addCommunityWrite } = useContractWrite({
    ...configAdd,
    onSuccess: ({ hash }) => {
      handleTxStart?.();
      dispatch(addTransaction({
        hash: hash,
        description: `Create Community "${formData.name}"`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message)
    },
  });

  useWaitForTransaction({
    hash: addCommunityData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        handleSuccess();
        resetForm();
      }
    },
  });

  // ------------- Update Community Methods -------------

  const { config: configEdit, error: errorEdit } = usePrepareContractWrite({
    ...mainContract,
    enabled: isFormDataValid,
    functionName: 'updateCommunity',
    args: [debouncedFormData.name, debouncedFormData.category, debouncedFormData.privacy, debouncedFormData.description, debouncedFormData.logoURL]
  });

  const { data: editCommunityData, write: editCommunityWrite } = useContractWrite({
    ...configEdit,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Save Community "${formData.name}"`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message)
    },
  });

  useWaitForTransaction({
    hash: editCommunityData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        handleSuccess();
      }
    },
  });

  // ------------- Form -------------

  useEffect(() => {
    setIsFormDataValid(!isFormErrors());
  }, [formData]);

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      logoURL: "",
      category: "",
      privacy: "",
      description: ""
    });
  }

  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "Error: Community name should be longer than 3 chars";
    }
    if (!formData.category.length) {
      return "Error: Please select Community category";
    }
    return false;
  }

  // ------------- Actions -------------

  const resizeImage = (e) => {
    const image = e.target.files[0];
    resizeFileImage(image, 256, 256).then(result => {
      setFormData({ ...formData, logo: result })
    });
  }

  const handleSave = (e) => {
    e.preventDefault();

    if (formData.logo.length) {
      setIsLoading(true);
      uploadMediaToIPFS(formData.logo, formData.name).then(logoURL => {
        setFormData({ ...formData, logoURL })
        _saveCommunity(logoURL);
      }).catch(e => {
        alert(e);
        setIsLoading(false);
      })
    } else {
      _saveCommunity("");
    }
  }

  const _saveCommunity = () => {
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsLoading(true);
    if (editCommunity) {
      editCommunityWrite?.();
    } else {
      addCommunityWrite?.();
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4 relative" onSubmit={handleSave}>
        <div>
          <div className="mb-1 block text-left">
            <Label htmlFor="name" value="Community Name" />
            <sup className={"text-red-400"}>*</sup>
          </div>
          <TextInput id="name"
                     type="text"
                     required={true}
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-1 block text-left">
              <Label htmlFor="category" value="Category" />
              <sup className={"text-red-400"}>*</sup>
            </div>
            <select name="category" id="category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300
                  text-gray-900 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-2.5 text-sm">
              <option key="-">&nbsp;</option>
              {communityTypes.map((oneType, index) => (
                <option value={index + 1} key={index}>{oneType}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <div className="mb-1 block text-left">
              <Label htmlFor="privacy" value="Privacy Level" />
            </div>
            <select name="privacy" id="privacy"
                    className="w-full block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300
                  text-gray-900 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-2.5 text-sm">
              <option value={0}>Public</option>
              <option value={1}>Private (whitelisted)</option>
            </select>
          </div>
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
          <Button type="Submit" gradientDuoTone="purpleToPink" disabled={isLoading}>
            <span className="uppercase">{editCommunity ? "Save" : "Create Community"}</span>
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