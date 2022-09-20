import React, { useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Container, InnerBlock, Wrapper } from "../../assets/css/common.style";
import { Link, useParams } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/all";
import { communityTypes } from "../../utils/settings";
import { useContractRead } from "wagmi";
import { mainContract } from "../../utils/contracts";
import { transformCommunity } from "../../utils/transform";
import { Breadcrumbs } from "@material-tailwind/react";
import { Loader } from "../../components/Loader";

export const CommunityLayout = () => {
  let { categoryId, communityId } = useParams();

  const { data: community } = useContractRead({
    ...mainContract,
    enabled: !!communityId,
    functionName: "communities",
    select: data => transformCommunity(data),
    args: [ communityId ]
  })

  useEffect(() => {
    console.log(`community`, community);
  }, [ community ])

  return (
    <div className="flex flex-col h-screen relative">
      <Header/>
      <div id="home" className="relative h-[80px] bg-primary mb-6"/>
      <div className="community-bg"/>

      <Wrapper>
        <Container className={"relative"}>
          {community ? (
            <>
              <div className={"mb-6 mt-4"}>
                <div className="absolute top-0 left-4 -mt-1">
                  <Breadcrumbs>
                    <Link to={"/"} className="opacity-80">
                      <MdKeyboardArrowLeft className="align-middle mr-1 inline"/> Home
                    </Link>
                    <Link to={`/category/${categoryId}`} className="opacity-80">
                      {communityTypes[categoryId - 1]} Communities
                    </Link>
                  </Breadcrumbs>
                </div>

                <h3 className={"text-center text-2xl font-semibold text-gray-800 w-2/3 mx-auto"}>
                  {community.name}
                </h3>
              </div>

              <div className="md:flex md:flex-row md:gap-8 justify-center">

                <InnerBlock className="border">
                  <div>test test</div>
                  <div>test test</div>
                </InnerBlock>


              </div>
            </>
          ) : (
            <Loader/>
          )}
        </Container>
      </Wrapper>

      <Footer/>
    </div>
  );
}
