import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { InnerBlock } from '../../assets/css/common.style';

export const Members = () => {
  const currentCommunity = useSelector(state => state.community.current);

  // useEffect(() => {
  //   console.log('currentCommunity', currentCommunity);
  // }, [ currentCommunity ]);

  return (
    <InnerBlock className={"flex-1"}>
      <div className="flex-auto">
        <InnerBlock.Header className="flex justify-between">
          <span>Community Members</span>
        </InnerBlock.Header>
        <div className="mt-8 text-gray-500">
          coming soon
        </div>
      </div>
    </InnerBlock>
  );
}
