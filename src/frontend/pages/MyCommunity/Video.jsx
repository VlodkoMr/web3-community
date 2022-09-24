import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { InnerBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { isContractAddress } from "../../utils/format";
import { PauseUnpausePopup } from "../../components/MyCommunity/PauseUnpausePopup";
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import { Button } from "@material-tailwind/react";
import { DeployNFTContract } from "../../components/MyCommunity/NftCollection/DeployNFTContract";

export const Video = () => {
  const currentCommunity = useSelector(state => state.community.current);

  // useEffect(() => {
  //   console.log('currentCommunity', currentCommunity);
  // }, [ currentCommunity ]);

  return (
    <div>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Video Streaming</span>
          <div className="-mt-3 justify-end">
            <Button>
              Create New Stream
            </Button>
          </div>
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <InnerBlock className={"flex-1"}>
        <div className="flex-auto">
          ...
        </div>
      </InnerBlock>
    </div>

  );
}
