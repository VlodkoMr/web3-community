import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { isContractAddress } from '../../utils/format';
import { Button } from '@material-tailwind/react';
import { DeployNFTContract } from '../../components/Community/NftCollection/DeployNFTContract';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity', currentCommunity);
  }, [ currentCommunity ]);

  useEffect(() => {
    if (window.contracts) {
      console.log('Dashboard load')
    }
  }, [ window.contracts ]);

  return (
    <>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Dashboard</span>
        </InnerBlock.Header>
        <div>
          ...
        </div>
      </InnerTransparentBlock>
    </>
  );
}
