import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, InnerBlock, InnerSmallBlock, InnerTransparentBlock } from '../../assets/css/common.style';
import { Link } from "react-router-dom";

export const MyDashboard = () => {
  const currentCommunity = useSelector(state => state.community.current);

  useEffect(() => {
    console.log('currentCommunity', currentCommunity);
  }, [ currentCommunity ]);

  useEffect(() => {
    if (window.contracts) {
      console.log('Dashboard load')
    }
  }, [ window.contracts ]);

  const InfoBlock = ({ title, value }) => (
    <InnerSmallBlock className={"w-1/4"}>
      <div className="flex-auto">
        <InnerSmallBlock.Header className="flex justify-between">
          {title}
        </InnerSmallBlock.Header>
        <div className="mt-2">
          {value}
        </div>
      </div>
    </InnerSmallBlock>
  );

  return (
    <>
      <InnerTransparentBlock>
        <InnerBlock.Header className="flex justify-between">
          <span>Dashboard</span>
          <div className={"text-sm flex flex-row"}>
            {currentCommunity.privacy === "0" ? (
              <>
                <span className="pt-1 text-gray-600">Public URL:</span>
                <Badge className={"border relative"}>
                  <Link to={`/category/2/1`}>{process.env.WEBSITE_URL}category/2/1</Link>
                </Badge>
                {/*<VscCopy className={"absolute right-1.5 top-1.5"}/>*/}
              </>
            ) : (
              <Badge className={"border border-red-100"}>
                <Link to={`/my/settings`} className={"text-red-400"}>Private Community</Link>
              </Badge>
            )}
          </div>
        </InnerBlock.Header>
      </InnerTransparentBlock>

      <div className="flex flex-row gap-6 mt-2">
        <InfoBlock title={"General Settings"} value={"..."}></InfoBlock>
        <InfoBlock title={"General Settings"} value={"..."}></InfoBlock>
        <InfoBlock title={"General Settings"} value={"..."}></InfoBlock>
        <InfoBlock title={"General Settings"} value={"..."}></InfoBlock>


      </div>

    </>
  );
}
