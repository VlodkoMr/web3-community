import React, { useEffect, useState } from "react";
import { NftList } from "../../components/CommunityPage/NftList";
import { Container, InnerBlock } from "../../assets/css/common.style";
import { Link, useOutletContext } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import { communityTypes, distributionCampaignsNFT } from "../../utils/settings";
import { Framework } from "@superfluid-finance/sdk-core";
import { useAccount, useContractRead, useNetwork, useProvider, useSigner } from "wagmi";
import { convertFromEther, formatNumber, isContractAddress, timestampToDate } from "../../utils/format";
import { transformFTCampaign } from "../../utils/transform";
import FungibleTokenABI from "../../contractsData/FungibleToken.json";
import { OneFTDistribution } from "../../components/MyCommunity/FungibleToken/OneFTDistribution";
import { OneTokenCampaign } from "../../components/CommunityPage/OneTokenCampaign";
import { mainContract } from "../../utils/contracts";

export const Dashboard = () => {
  const [ community ] = useOutletContext();
  // const { address } = useAccount();
  const { chain } = useNetwork();
  const provider = useProvider();
  const [ tokenSymbol, setTokenSymbol ] = useState("");
  const [ totalSupply, setTotalSupply ] = useState("");
  // const [ myBalance, setMyBalance ] = useState("");
  const [ isTokenReady, setIsTokenReady ] = useState(false);
  const [ ftCampaignTitles, setFtCampaignTitles ] = useState({});

  const loadCampaignsTitle = () => {
    let ftCampaigns = {};
    distributionCampaignsNFT.map(camp => {
      ftCampaigns[camp.id] = camp.title;
    });
    setFtCampaignTitles(ftCampaigns);
  }

  const myFTContract = {
    addressOrName: community?.ftContract,
    contractInterface: FungibleTokenABI.abi,
  }

  const { data: communityFTCampaigns } = useContractRead({
    ...myFTContract,
    enabled: isContractAddress(community?.ftContract),
    functionName: "getCampaigns",
    select: (data) => data.map(camp => transformFTCampaign(camp))
  });

  const loadSuperToken = async () => {
    const sf = await Framework.create({
      chainId: chain.id,
      provider
    });

    if (isContractAddress(community.ftContract)) {
      const superToken = await sf.loadSuperToken(community.ftContract);
      const symbol = await superToken.symbol({ providerOrSigner: provider });
      const supply = await superToken.totalSupply({ providerOrSigner: provider });
      // const myBalance = await superToken.balanceOf({ providerOrSigner: provider, account: address });

      setTokenSymbol(symbol);
      setTotalSupply(supply);
      // setMyBalance(myBalance);
    }

    setIsTokenReady(true);
  }

  useEffect(() => {
    loadSuperToken();
    loadCampaignsTitle();
  }, [ community ]);

  return (
    <>
      <Container className={"relative flex flex-row gap-6"}>
        <div className={"flex-1"}>
          <div className={"flex flex-row"}>
            <Container className={"w-64"}>
              <Breadcrumbs>
                <Link to="/">Home</Link>
                <Link to={`/category/${community.category}`}>{communityTypes[community.category - 1]}</Link>
              </Breadcrumbs>
            </Container>

            <h3 className={"flex-auto text-center text-xl pt-1 font-semibold text-gray-800 mb-12"}>NFT Collection</h3>
            <div className={"w-64"}/>
          </div>

          <NftList community={community}/>
        </div>

        {(isTokenReady && parseInt(totalSupply) > 0) && (
          <div className={"w-1/3 relative mb-8"}>
            <h3 className={"text-lg font-semibold text-gray-800 border-b pt-2 pb-4 text-center"}>
              Community Token
            </h3>
            <InnerBlock className={"w-full text-center mt-1"}>
              <div>
                <p>Total Supply: <b>{formatNumber(convertFromEther(totalSupply))} {tokenSymbol}</b></p>
                <div className={"mt-3 mb-6 pt-3 text-sm border-t"}>
                  There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form.
                </div>

                {communityFTCampaigns?.length > 0 && (
                  <>
                    <b className={"block mb-1 font-semibold text-left text-sm"}>Distribution Campaigns</b>
                    <div className={"text-left"}>
                      {communityFTCampaigns.map(campaign => (
                        <OneTokenCampaign
                          key={campaign.id}
                          campaign={campaign}
                          community={community}
                          tokenSymbol={tokenSymbol}
                          ftCampaignTitles={ftCampaignTitles}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </InnerBlock>
          </div>
        )}
      </Container>

    </>
  );
}
