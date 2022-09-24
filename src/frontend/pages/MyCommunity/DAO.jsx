import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';

export const DAO = () => {
  const currentCommunity = useSelector(state => state.community.current);

  // useEffect(() => {
  //   console.log('currentCommunity', currentCommunity);
  // }, [ currentCommunity ]);

  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>DAO (coming soon)</span>
          {/*<div className="-mt-3 justify-end">*/}
          {/*  <Button>*/}
          {/*    Create*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          You members will be able to vote and participate in the <br/>
          management and decision-making by holding <b>your NFT or Tokens</b>.
        </div>
      </InnerBlock>
    </div>
  );
}
