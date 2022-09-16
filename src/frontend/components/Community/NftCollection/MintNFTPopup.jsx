import React, { useEffect, useState } from "react";
import { Label, TextInput, Button, Modal, Spinner } from 'flowbite-react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { ImInfinite } from 'react-icons/im';

export function MintNFTPopup({ popupVisible, setPopupVisible, handleSuccess, currentCommunity, collection }) {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    account: "",
    amount: ""
  });

  const [debouncedFormData] = useDebounce(formData, 300);
  const { config: configMint, error: errorMint } = usePrepareContractWrite({
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: debouncedFormData.account.length > 0 && parseInt(debouncedFormData.amount) > 0,
    functionName: 'mint',
    args: [formData.account, collection?.id, formData.amount]
  });

  const { data: mintData, write: mintWrite } = useContractWrite({
    ...configMint,
    onSuccess: ({ hash }) => {
      setPopupVisible(false);
      setIsSubmitLoading(false);
      resetForm();

      dispatch(addTransaction({
        hash: hash,
        description: `Mint NFT`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setIsSubmitLoading(false);
    },
  });

  useWaitForTransaction({
    hash: mintData?.hash,
    onError: error => {
      console.log('is err', error)
    },
    onSuccess: data => {
      if (data) {
        handleSuccess?.();
      }
    },
  });

  const handleMintNFT = (e) => {
    e.preventDefault();
    const formError = isFormErrors();
    if (formError) {
      alert(formError);
      return;
    }

    setIsSubmitLoading(true);
    mintWrite();
  }

  const resetForm = () => {
    setFormData({
      account: "",
      amount: ""
    });
  }

  useEffect(() => {
    if (errorMint) {
      console.log('errorUpload', errorMint);
    }
  }, [errorMint]);

  // useEffect(() => {
  //   setIsFormDataValid(!isFormErrors());
  // }, [formData]);

  const isFormErrors = () => {
    if (formData.account.length < 1) {
      return "Wrong account address";
    }
    if (collection.supply > 0) {
      if (collection.supply < collection.mintedTotal + formData.amount) {
        return "Not enough NFT supply";
      }
    }
    if (parseInt(formData.amount) < 1) {
      return "Wrong mint amount";
    }
    return false;
  }

  const setMyAddress = () => {
    setFormData({ ...formData, account: address })
  }

  return (
    <>
      <Modal
        popup={true}
        show={popupVisible}
        onClose={() => setPopupVisible(false)}
      >
        <Modal.Header />
        {collection && (
          <Modal.Body>
            <div className="text-lg pb-4 mb-8 -mt-8 text-center w-full border-b text-gray-500 font-semibold">
              Mint NFT
            </div>

            <form className="flex flex-row px-4 gap-8 relative" onSubmit={handleMintNFT}>
              <div className="w-36">
                <img className="mt-2 h-36 w-36 bg-gray-50 rounded-lg object-cover" src={collection.mediaUri} alt="" />
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <div className="mb-1 block text-left flex justify-between">
                    <div>
                      <Label htmlFor="account" value={`Send to wallet`} />
                      <sup className={"text-red-400"}>*</sup>
                    </div>
                    <div className="text-sm text-gray-500 underline cursor-pointer" onClick={() => setMyAddress()}>
                      set my wallet address
                    </div>
                  </div>
                  <TextInput id="account"
                             type="text"
                             required={true}
                             value={formData.account}
                             onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                  />
                </div>

                <div className="flex flex-row mb-3">
                  <div className="w-48">
                    <div className="mb-1 block text-left">
                      <Label htmlFor="amount" value="NFT Amount" />
                      <sup className={"text-red-400"}>*</sup>
                    </div>
                    <TextInput id="amount"
                               type="number"
                               min={0}
                               max={1000000000}
                               required={true}
                               value={formData.amount}
                               onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="text-sm text-gray-500 ml-6 pt-10 -mt-1">
                    Total Supply: {collection.supply === 0 ? <ImInfinite size="16" className="inline" /> : `${collection.supply} NFT`}
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-5 border-t">
                  <div className="text-gray-500 text-sm pt-2" />
                  <Button type="Submit"
                          disabled={!mintWrite}
                          gradientDuoTone="purpleToPink"
                          onClick={handleMintNFT}>
                    <span className="uppercase">
                      Mint NFT &raquo;
                    </span>
                  </Button>
                </div>
              </div>

              {isSubmitLoading && (
                <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
                  <div className={"w-12 mx-auto mt-10"}>
                    <Spinner size={10} />
                  </div>
                </div>
              )}
            </form>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}
