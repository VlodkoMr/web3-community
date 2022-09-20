import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { communityTypes } from '../../utils/settings';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { mainContract } from '../../utils/contracts';
import { Loader } from '../Loader';
import { Input, Button, Option, Select, Textarea } from '@material-tailwind/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { resizeFileImage, uploadMediaToIPFS } from "../../utils/media";
import { mediaURL } from "../../utils/format";

export function EditCommunity({ handleSuccess, handleTxStart, editCommunity }) {
  const dispatch = useDispatch();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isMediaLoading, setIsMediaLoading ] = useState(false);
  const [ editFormData, setEditFormData ] = useState({});
  const [ addFormData, setAddFormData ] = useState({});
  const [ formData, setFormData ] = useState({
    name: editCommunity?.name || "",
    category: editCommunity?.category || "",
    privacy: editCommunity?.privacy || "0",
    logo: editCommunity?.logo || "",
    description: editCommunity?.description || ""
  });

  // ------------- Create Community Methods -------------

  const { config: configAdd, error: errorAdd } = usePrepareContractWrite({
    ...mainContract,
    enabled: !editCommunity && addFormData.name?.length > 0,
    functionName: 'createCommunity',
    args: [ addFormData.name, addFormData.logo, addFormData.category, addFormData.privacy, addFormData.description ]
  });

  const { data: addCommunityData, write: addCommunityWrite, status: addCommunityStatus } = useContractWrite({
    ...configAdd,
    onSuccess: ({ hash }) => {
      handleTxStart?.();
      dispatch(addTransaction({
        hash: hash,
        description: `Create Community "${formData.name}"`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setIsLoading(false);
      setAddFormData({});
    },
  });

  useWaitForTransaction({
    hash: addCommunityData?.hash,
    onError: error => {
      console.log('is err', error);
      setAddFormData({});
    },
    onSuccess: data => {
      console.log(`community created`);

      setIsLoading(false);
      resetForm();
      if (data) {
        handleSuccess?.();
      }
    },
  });

  useEffect(() => {
    if (addCommunityWrite && addCommunityStatus !== 'loading') {
      addCommunityWrite();
    }
  }, [ addCommunityWrite ]);

  useEffect(() => {
    console.log(`errorAdd`, errorAdd);
  }, [ errorAdd ]);

  useEffect(() => {
    console.log(`addCommunityStatus`, addCommunityStatus);
  }, [ addCommunityStatus ]);

  // ------------- Update Community Methods -------------

  const { config: configEdit, error: errorEdit } = usePrepareContractWrite({
    ...mainContract,
    enabled: !!editCommunity && editFormData.name?.length > 0,
    functionName: 'updateCommunity',
    args: [ editCommunity?.id, editFormData.name, editFormData.logo, editFormData.privacy, editFormData.description ]
  });

  const { data: editCommunityData, write: editCommunityWrite, status: editCommunityStatus } = useContractWrite({
    ...configEdit,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Save Community "${formData.name}"`
      }));
    },
    onError: ({ message }) => {
      setIsLoading(false);
      setEditFormData({});
      console.log('onError message', message);
    },
  });

  useWaitForTransaction({
    hash: editCommunityData?.hash,
    onError: error => {
      console.log('is err', error);
      setEditFormData({});
    },
    onSuccess: data => {
      setIsLoading(false);
      setEditFormData({});
      if (data) {
        handleSuccess?.();
      }
    },
  });

  useEffect(() => {
    if (editCommunityWrite && editCommunityStatus !== 'loading') {
      editCommunityWrite();
    }
  }, [ editCommunityWrite ]);

  // ------------- Form -------------

  // Load community for edit
  useEffect(() => {
    setFormData({
      name: editCommunity?.name || "",
      category: editCommunity?.category || "",
      privacy: editCommunity?.privacy || "0",
      logo: editCommunity?.logo || "",
      description: editCommunity?.description || ""
    });
  }, [ editCommunity ]);

  // Reset form
  const resetForm = () => {
    setAddFormData({});
    setEditFormData({});
    setFormData({
      name: "",
      logo: "",
      category: "",
      privacy: "",
      description: ""
    });
  }

  // Check form errors
  const isFormErrors = () => {
    if (formData.name.length < 3) {
      return "Community name should be longer than 3 chars";
    }
    if (!formData.category.toString().length) {
      return "Please select Community category";
    }
    return false;
  }

  // ------------- Actions -------------

  const resizeImage = (e) => {
    const image = e.target.files[0];
    resizeFileImage(image, 400, 400).then(blobData => {
      setIsMediaLoading(true);

      uploadMediaToIPFS(blobData).then(result => {
        setFormData({ ...formData, logo: result });
        setIsMediaLoading(false);
      }).catch(e => setIsMediaLoading(false));
    });
  }

  // Save community
  const saveCommunity = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsLoading(true);
    if (editCommunity) {
      setEditFormData({ ...formData });
    } else {
      setAddFormData({ ...formData });
    }
  }

  return (
    <>
      <form className="flex flex-col gap-4 relative" onSubmit={saveCommunity}>
        <div>
          <Input type="text"
                 label="Community Name*"
                 required={true}
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className={`flex flex-row`}>
          <div className={`flex-auto`}>
            <Input type="file"
                   accept="image/*"
                   label={`${!!editCommunity ? "Update " : ""} Logo`}
                   className="h-[47px]"
                   onChange={(e) => resizeImage(e)}
            />
          </div>
          {editCommunity && editCommunity.logo.length > 0 && (
            <img className="w-12 h-12 text-sm bg-gray-100 object-fill rounded-full ml-6"
                 src={mediaURL(editCommunity.logo)}
                 alt="logo"/>
          )}
        </div>
        <div className="flex gap-6 text-left">
          <div className="flex-1">
            <Select label="Category*"
                    value={formData.category}
                    placeholder="Select Category"
                    disabled={!!editCommunity}
                    onChange={val => setFormData({ ...formData, category: val })}>
              {communityTypes.map((oneType, index) => (
                <Option value={(index + 1).toString()} key={index}>
                  {oneType}
                </Option>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <Select label="Privacy Level*"
                    value={formData.privacy}
                    onChange={val => setFormData({ ...formData, privacy: val })}>
              <Option value={"0"}>Public</Option>
              <Option value={"1"}>Private</Option>
            </Select>
          </div>
        </div>

        <Textarea label="Description"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  value={formData.description}
        />

        <div className={"flex justify-end"}>
          <Button type="Submit" variant="gradient" disabled={isFormErrors() || isMediaLoading}>
            {isMediaLoading && (
              <span className="mr-2 align-bottom">
                <Loader size={"sm"}/>
              </span>
            )}
            {editCommunity ? "Save" : "Create Community"}
            <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
          </Button>
        </div>

        {(isLoading || isMediaLoading) && (
          <div className="bg-white/80 absolute top-[-10px] bottom-0 right-0 left-0 z-10">
            <div className={"w-64 mx-auto mt-10"}>
              <div className="w-12 mb-3 mx-auto">
                <Loader/>
              </div>
              {isMediaLoading && (
                <>Please wait, uploading media...</>
              )}
            </div>
          </div>
        )}
      </form>
    </>
  );
}
