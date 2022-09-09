import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InnerBlock } from '../../assets/css/common.style';
import { convertFromEther, FormatNumber, isContractAddress } from '../../utils/format';
import { Button, Card } from 'flowbite-react';
import { DeployNFTContract } from '../../components/Community/DeployNFTContract';
import { EditCommunity } from '../../components/Community/EditCommunity';

export const Settings = () => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity');
  }, [currentCommunity]);

  useEffect(() => {
    if (window.contracts) {
      console.log('Settings load')
      setIsReady(true);
    }
  }, [window.contracts]);

  return (
    <div className="flex gap-6">
      {isReady && (
        <>
          <InnerBlock className={"flex-1"}>
            <InnerBlock.Header className="flex justify-between">
              <span>General Settings</span>
            </InnerBlock.Header>
            <div className="mt-4">
              <EditCommunity editCommunity={currentCommunity} />
            </div>
          </InnerBlock>

          <InnerBlock className={"flex-1"}>
            <InnerBlock.Header className="flex justify-between">
              <span>Community Links</span>
            </InnerBlock.Header>
            <div className="mt-4">
              ...
            </div>
          </InnerBlock>
        </>
      )}
    </div>
  );
}
