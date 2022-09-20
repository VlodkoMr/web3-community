import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { InnerBlock } from '../../assets/css/common.style';
import { EditCommunity } from '../../components/Community/EditCommunity';
import { useOutletContext } from 'react-router-dom';

export const Settings = () => {
  const [ reloadCommunityList ] = useOutletContext();
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity', currentCommunity);
  }, [ currentCommunity ]);

  return (
    <div className="flex gap-6">
      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          <InnerBlock.Header className="flex justify-between">
            <span>General Settings</span>
          </InnerBlock.Header>
          <div className="mt-8">
            <EditCommunity editCommunity={currentCommunity} handleSuccess={() => reloadCommunityList()}/>
          </div>
        </div>
      </InnerBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          <InnerBlock.Header className="flex justify-between">
            <span>Community Links</span>
          </InnerBlock.Header>
          <div className="mt-8">
            ...
          </div>
        </div>
      </InnerBlock>
    </div>
  );
}
