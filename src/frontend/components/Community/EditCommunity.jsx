import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/transactionSlice';
import { communityTypes } from '../../utils/settings';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { mainContract } from '../../utils/requests';
import { Loader } from '../Loader';
import { Input, Button, Option, Select, Textarea } from '@material-tailwind/react';
import { MdKeyboardArrowRight } from 'react-icons/md';

export function EditCommunity({ handleSuccess, handleTxStart, editCommunity }) {
  const dispatch = useDispatch();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ editFormData, setEditFormData ] = useState({});
  const [ addFormData, setAddFormData ] = useState({});
  const [ formData, setFormData ] = useState({
    name: editCommunity?.name || "",
    category: editCommunity?.category || "",
    privacy: editCommunity?.privacy || "0",
    // logo: editCommunity?.logo || "",
    // logoData: "",
    description: editCommunity?.description || ""
  });

  // ------------- Create Community Methods -------------

  const { config: configAdd, error: errorAdd } = usePrepareContractWrite({
    ...mainContract,
    enabled: !editCommunity && addFormData.name?.length > 0,
    functionName: 'createCommunity',
    args: [ addFormData.name, addFormData.category, addFormData.privacy, addFormData.description ]
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

  // ------------- Update Community Methods -------------

  const { config: configEdit, error: errorEdit } = usePrepareContractWrite({
    ...mainContract,
    enabled: !!editCommunity && editFormData.name?.length > 0,
    functionName: 'updateCommunity',
    args: [ editCommunity?.id, editFormData.name, editFormData.privacy, editFormData.description ]
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
      description: editCommunity?.description || ""
    });
  }, [ editCommunity ]);

  // Reset form
  const resetForm = () => {
    setAddFormData({});
    setEditFormData({});
    setFormData({
      name: "",
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

  // const resizeImage = (e) => {
  //   const image = e.target.files[0];
  //   resizeFileImage(image, 256, 256).then(result => {
  //     setFormData({ ...formData, logoData: result })
  //   });
  // }

  // const handleSave = (e) => {
  //   e.preventDefault();
  //   if (formData.logoData.length) {
  //     setIsLoading(true);
  //     uploadMediaToIPFS(formData.logoData, formData.name).then(logoURL => {
  //       setFormData({ ...formData, logo: logoURL })
  //       _saveCommunity();
  //     }).catch(e => {
  //       alert(e);
  //       setIsLoading(false);
  //     })
  //   } else {
  //     _saveCommunity();
  //   }
  // }

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
              <Option value={"1"}>Private (whitelisted)</Option>
            </Select>
          </div>
        </div>
        {/*<div>*/}
        {/*  <div className="mb-1 block text-left">*/}
        {/*    <Label htmlFor="logo" value="Logo" />*/}
        {/*  </div>*/}
        {/*  <FileInput id="logo"*/}
        {/*             accept="image/*"*/}
        {/*             onChange={(e) => resizeImage(e)}*/}
        {/*  />*/}
        {/*</div>*/}
        <Textarea label="Description"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  value={formData.description}
        />

        <div className={"flex justify-end"}>
          <Button type="Submit" variant="gradient" disabled={isFormErrors()}>
            {editCommunity ? "Save" : "Create Community"}
            <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
          </Button>
        </div>

        {isLoading && (
          <div className="bg-white/80 absolute top-[-10px] bottom-0 right-0 left-0 z-10">
            <div className={"w-12 mx-auto mt-10"}>
              <Loader/>
            </div>
          </div>
        )}
      </form>
    </>
  );
}
