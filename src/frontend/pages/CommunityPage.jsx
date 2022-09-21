import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container, InnerBlock, Wrapper } from "../assets/css/common.style";
import { useParams } from "react-router-dom";
import {
  RiTelegramLine,
  TiSocialFacebookCircular,
  TiSocialInstagramCircular,
  TiSocialTwitterCircular
} from "react-icons/all";
import { communityTypes, defaultCommunityLogo } from "../utils/settings";
import { useContractRead } from "wagmi";
import { mainContract } from "../utils/contracts";
import { transformCommunity } from "../utils/transform";
import { Loader } from "../components/Loader";
import { mediaURL } from "../utils/format";
import { NftList } from "../components/CommunityPage/NftList";
import { connect } from '@tableland/sdk';
import { useContract, useSigner } from 'wagmi';

export const CommunityPage = () => {
  let { categoryId, communityId } = useParams();
  const { data: signer, isError, isLoading } = useSigner();

  const { data: community } = useContractRead({
    ...mainContract,
    enabled: !!communityId,
    functionName: "communities",
    select: data => transformCommunity(data),
    args: [ communityId ]
  });

  const testTableland = async () => {
    // const tableland = await connect({
    //   signer,
    //   // name: "localhost",
    //   // chain: "localhost",
    //   network: "custom",
    //   chainId: 31337,
    //   contract: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    //   host: "http://localhost:8080/chain/31337/tables/"
    // });
    // await tableland.siwe();

    // console.log(`tableland`, tableland);
    //
    // // const tables = await tableland.list();
    // // console.log(`tables`, tables);
    // const { name } = await tableland.create(
    //   `id integer primary key, name text`, // Table schema definition
    //   {
    //     prefix: `my_sdk_table` // Optional `prefix` used to define a human-readable string
    //   }
    // );
  };

  useEffect(() => {
    // console.log(`community`, community);
    testTableland();
  }, [ community ])

  return (
    <div className="flex flex-col h-screen relative">
      <Header/>

      {community ? (
        <>
          <div className="h-[100px] bg-primary mb-20 pt-40">

            <Container>
              <div className="relative flex flex-col flex-auto min-w-0 p-4 -mt-16 overflow-hidden break-words shadow-gray-300/50 shadow-lg
              rounded-2xl bg-white/80 bg-clip-border backdrop-blur-2xl backdrop-saturate-200">
                <div className="flex flex-wrap -mx-3">
                  <div className="px-3">
                    <div
                      className="text-base ease-soft-in-out w-20 h-20 relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200">
                      <img src={mediaURL(community.logo || defaultCommunityLogo)} alt="logo" className="w-full shadow-soft-sm rounded-xl"/>
                    </div>
                  </div>
                  <div className="px-3 flex-1 h-full">
                    <h5 className="mb-1 text-2xl font-semibold">{community.name}</h5>
                    <p className={"mb-0 leading-normal text-gray-500 text-sm"}>
                      {community.description.length > 1 ? (
                        <>{community.description}</>
                      ) : (
                        <>{community.privacy === "0" ? "Public" : "Private"} {communityTypes[categoryId - 1]} Community</>
                      )}
                    </p>
                  </div>
                  <div className="flex-4 text-right mr-3">
                    <a href="" target="_blank" className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <TiSocialInstagramCircular size={"26"}/>
                    </a>
                    <a href="" target="_blank" className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <TiSocialTwitterCircular size={"26"}/>
                    </a>
                    <a href="" target="_blank" className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <RiTelegramLine size={"26"}/>
                    </a>
                    <a href="" target="_blank" className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <TiSocialFacebookCircular size={"26"}/>
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <div className="community-bg"/>

          <Wrapper>
            <Container className={"relative flex flex-row gap-6"}>
              <InnerBlock className={"w-2/3"}>
                <div>
                  <h3 className={"text-lg font-semibold text-gray-800 mb-4"}>NFT Collection</h3>
                  <NftList community={community}/>
                </div>
              </InnerBlock>

              <InnerBlock className={"w-1/3"}>
                <div>
                  <h3 className={"text-lg font-semibold text-gray-800 mb-4"}>XXX Token</h3>
                  <p>...</p>
                </div>
              </InnerBlock>
            </Container>
          </Wrapper>
        </>
      ) : (
        <Loader/>
      )}

      <Footer/>
    </div>
  );
}
