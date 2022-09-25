import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { Button } from "@material-tailwind/react";

export const Raffle = () => {
  const currentCommunity = useSelector(state => state.community.current);

  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Raffle (coming soon)</span>
          <div className="-mt-3 justify-end">
            <Button>
              New Raffle
            </Button>
          </div>
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          Create raffle and <b>get random winners</b> from your NFT Holders!
        </div>
      </InnerBlock>
    </div>
  );
}
