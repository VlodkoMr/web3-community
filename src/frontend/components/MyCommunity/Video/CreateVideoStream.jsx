import React, { useEffect, useState } from "react";
import { resizeFileImage, uploadNFTtoIPFS } from '../../../utils/media';
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../../store/transactionSlice';
import { MdKeyboardArrowRight, MdOutlineAddCircleOutline, MdOutlineCancel } from 'react-icons/md';
import { convertToEther } from '../../../utils/format';
import { getTokenName } from '../../../utils/settings';
import { Loader } from '../../Loader';
import { Button, Textarea, Input } from '@material-tailwind/react';
import { Popup } from '../../Popup';
import { MdKeyboardArrowLeft } from 'react-icons/all';
import NFTCollectionABI from '../../../contractsData/NFTCollection.json';

export function CreateVideoStream({ popupVisible, setPopupVisible, handleSuccess }) {
  const [ isLoading, setIsLoading ] = useState(false);
  const [ streamName, setStreamName ] = useState("");

  const handleCreateStream = async (e) => {
    e.preventDefault();

    if (streamName.length < 3) {
      alert("Please provide stream name");
      return false;
    }

    setIsLoading(true);
    const profiles = [
      {
        name: '720p',
        bitrate: 2000000,
        fps: 30,
        width: 1280,
        height: 720,
      },
      {
        name: '480p',
        bitrate: 1000000,
        fps: 30,
        width: 854,
        height: 480,
      },
    ];

    fetch(`${process.env.SERVER_URL}/api/create-stream`, {
      method: 'POST',
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: streamName,
        profiles
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setIsLoading(false);
        handleSuccess?.();
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
        alert(error);
      });
  }

  return (
    <>
      <Popup title="Create Video Stream"
             isVisible={popupVisible}
             setIsVisible={setPopupVisible}>
        <form className="flex flex-col gap-4 relative" onSubmit={handleCreateStream}>

          <div className="mb-3">
            <Input type="text"
                   label="Stream Name*"
                   required={true}
                   value={streamName}
                   onChange={(e) => setStreamName(e.target.value)}
            />
          </div>

          <div className="text-sm underline">
            Profiles edit (coming soon)
          </div>

          <div className="flex justify-end">
            <Button type="Submit">
              Create Stream
              <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
            </Button>
          </div>

          {isLoading && (
            <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
              <div className={"w-12 mx-auto mt-10"}>
                <Loader/>
              </div>
            </div>
          )}
        </form>
      </Popup>
    </>
  );
}
