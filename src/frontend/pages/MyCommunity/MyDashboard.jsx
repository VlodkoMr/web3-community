import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, InnerBlock, InnerSmallBlock, InnerTransparentBlock, TableTd, TableTh } from '../../assets/css/common.style';
import { Link } from "react-router-dom";
import { useAccount, useContractRead } from "wagmi";
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import FungibleTokenABI from '../../contractsData/FungibleToken.json';
import { convertFromEther, formatNumber, isContractAddress } from "../../utils/format";
import { transformFTCampaign } from "../../utils/transform";
import { mainContract } from "../../utils/contracts";

export const MyDashboard = () => {
  const { address } = useAccount();
  const currentCommunity = useSelector(state => state.community.current);

  // const { data: memberStatsTable } = useContractRead({
  //   ...mainContract,
  //   functionName: "memberStatsTable",
  // });
  //
  // const loadLastActivity = async () => {
  //   const selectLastSQL = `SELECT * FROM ${memberStatsTable}`;
  //   const activity = await fetch(`https://testnet.tableland.network/query?s=${selectLastSQL}`);
  //   console.log(`activity`, activity);
  // }
  //
  // useEffect(() => {
  //   if (memberStatsTable) {
  //     console.log(`memberStatsTable`, memberStatsTable);
  //     loadLastActivity();
  //   }
  // }, [ memberStatsTable ]);


  // ---------------- NFT ----------------

  const myNFTContract = {
    addressOrName: currentCommunity?.nftContract,
    contractInterface: NFTCollectionABI.abi
  };

  const { data: totalCollections } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "collectionsTotal",
  });

  const { data: mintedTotal } = useContractRead({
    ...myNFTContract,
    enabled: isContractAddress(currentCommunity?.nftContract),
    functionName: "mintedTotal",
  });

  // ---------------- FT ----------------

  const myFTContract = {
    addressOrName: currentCommunity?.ftContract,
    contractInterface: FungibleTokenABI.abi
  };

  const { data: distributionFTCampaigns } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(currentCommunity?.ftContract),
    functionName: "getCampaigns",
    select: (data) => data.map(camp => transformFTCampaign(camp))
  });

  // ---------------- Actions ----------------

  // useEffect(() => {
  //   console.log('currentCommunity', currentCommunity);
  // }, [ currentCommunity ]);

  // useEffect(() => {
  //   console.log('mintedTotal', mintedTotal);
  // }, [ mintedTotal ]);

  useEffect(() => {
    if (window.contracts) {
      console.log('Dashboard load')
    }
  }, [ window.contracts ]);

  const InfoBlock = ({ title, value }) => (
    <InnerSmallBlock className={"w-1/4"}>
      <div className="flex-auto">
        <div className="flex justify-between text-sm text-gray-500 ml-1 font-medium">
          {title}
        </div>
        <div className="mt-2 text-3xl text-gray-800 text-right mr-2">
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
                <Badge className={"border relative bg-blue-50/50 border-blue-100"}>
                  <Link className={"text-blue-600"} to={`/category/${currentCommunity.category}/${currentCommunity.id}`}>
                    {process.env.WEBSITE_URL}category/{currentCommunity.category}/{currentCommunity.id}
                  </Link>
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
        <InfoBlock title={"NFT Series"} value={parseInt(totalCollections || "0")}></InfoBlock>
        <InfoBlock title={"FT Campaigns"} value={distributionFTCampaigns?.length || "0"}></InfoBlock>
        <InfoBlock title={"New Members (24h)"} value={"0"}></InfoBlock>
        <InfoBlock title={"New Members (30d)"} value={"0"}></InfoBlock>
      </div>
      <div className={"mt-6 border-t pt-4 mb-8"}>
        <InnerBlock>
          <div className={"w-full"}>
            <InnerBlock.Header>Last Activity</InnerBlock.Header>

            <table className="border-collapse table-auto w-full text-sm mt-4 opacity-50">
              <thead className={"bg-gray-50"}>
              <tr>
                <TableTh>Member</TableTh>
                <TableTh>Action</TableTh>
                <TableTh>Series / Campaign</TableTh>
                <TableTh>Payment</TableTh>
                <TableTh>Date</TableTh>
              </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
              <tr>
                <TableTd>0x71fd...45e3</TableTd>
                <TableTd>Mint NFT</TableTd>
                <TableTd>Serie v1</TableTd>
                <TableTd>&minus;</TableTd>
                <TableTd>26.05.2022</TableTd>
              </tr>
              <tr>
                <TableTd>0x93fd...46e4</TableTd>
                <TableTd>Claim FT</TableTd>
                <TableTd>Serie v2</TableTd>
                <TableTd>&minus;</TableTd>
                <TableTd>25.05.2022</TableTd>
              </tr>
              <tr>
                <TableTd>0xkd73...653c</TableTd>
                <TableTd>Mint NFT</TableTd>
                <TableTd>Serie v1</TableTd>
                <TableTd>+10 Matic</TableTd>
                <TableTd>25.05.2022</TableTd>
              </tr>
              </tbody>
            </table>
          </div>
        </InnerBlock>
      </div>

    </>
  );
}
