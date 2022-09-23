import React, { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Container, Wrapper } from "../../assets/css/common.style";
import { Link, Outlet, useParams } from "react-router-dom";
import { RiTelegramLine, TiSocialFacebookCircular, TiSocialInstagramCircular, TiSocialTwitterCircular } from "react-icons/all";
import { communityTypes, defaultCommunityLogo } from "../../utils/settings";
import { useContractRead } from "wagmi";
import { mainContract } from "../../utils/contracts";
import { transformCommunity } from "../../utils/transform";
import { Loader } from "../../components/Loader";
import { mediaURL } from "../../utils/format";

export const CommunityPageLayout = () => {
  let { categoryId, communityId } = useParams();

  const { data: community } = useContractRead({
    ...mainContract,
    enabled: !!communityId,
    functionName: "communities",
    select: data => transformCommunity(data),
    args: [ communityId ]
  });

  useEffect(() => {
    console.log(`community`, community);
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
                      <Link to={`/category/${community.category}/${community.id}`}>
                        <img src={mediaURL(community.logo || defaultCommunityLogo)}
                             alt="logo"
                             className="w-20 h-20 object-cover shadow-soft-sm rounded-xl"/>
                      </Link>
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
                    <a href="src/frontend/pages/CommunityPage/CommunityPage" target="_blank"
                       className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <TiSocialInstagramCircular size={"30"}/>
                    </a>
                    <a href="src/frontend/pages/CommunityPage/CommunityPage" target="_blank"
                       className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <TiSocialTwitterCircular size={"30"}/>
                    </a>
                    <a href="src/frontend/pages/CommunityPage/CommunityPage" target="_blank"
                       className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <RiTelegramLine size={"30"}/>
                    </a>
                    <a href="src/frontend/pages/CommunityPage/CommunityPage" target="_blank"
                       className={"w-8 inline-block opacity-70 hover:opacity-90"}>
                      <TiSocialFacebookCircular size={"30"}/>
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <div className="community-bg"/>

          <Wrapper>
            <Outlet context={[ community ]}/>
          </Wrapper>
        </>
      ) : (
        <div className={"h-screen"}>
          <div className={"w-12 mx-auto mt-16"}>
            <Loader/>
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
}
