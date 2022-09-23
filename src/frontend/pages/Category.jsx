import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Badge, Container, Wrapper } from "../assets/css/common.style";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { transformCommunity } from "../utils/transform";
import { Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { mainContract } from "../utils/contracts";
import { communityTypes, defaultCommunityLogo } from "../utils/settings";
import { MdKeyboardArrowLeft } from "react-icons/all";
import { isContractAddress, mediaURL } from "../utils/format";

export const Category = () => {
  let { categoryId } = useParams();
  const navigate = useNavigate();

  const { data: communities } = useContractRead({
    ...mainContract,
    enabled: !!categoryId,
    functionName: "getCategoryCommunities",
    select: data => data.filter(community => !community.isProtected).map(community => transformCommunity(community)),
    args: [ categoryId ]
  })

  useEffect(() => {
    console.log(`communities`, communities);
  }, [ communities ])

  return (
    <div className="flex flex-col h-screen relative">
      <Header/>
      <div className="relative h-[80px] bg-primary mb-6"/>
      <div className="community-bg"/>

      <Wrapper>
        <Container className={"relative"}>
          <div className={"mb-6 mt-4"}>
            <Link to={"/"} className="absolute top-0 left-0 bg-blue-gray-50 bg-opacity-60 py-2 px-4 text-sm rounded-md -mt-1">
              <span className="opacity-80">
                <MdKeyboardArrowLeft className="align-middle mr-1 inline"/> Home
              </span>
            </Link>

            <h3 className={"text-center text-2xl font-semibold text-gray-800"}>
              {communityTypes[categoryId - 1]} Communities
            </h3>
          </div>

          <div className="md:flex md:flex-row md:gap-8 justify-center">
            {communities?.length > 0 ? communities.map(community => (
              <Card className="w-96 border border-gray-100 mb-8 cursor-pointer hover:shadow-lg hover:border-gray-200 transition"
                    key={community.id}
                    onClick={() => navigate(`/category/${categoryId}/${community.id}`)}>
                <CardBody>
                  <div className="flex flex-row gap-5 mb-3">
                    <img src={mediaURL(community.logo || defaultCommunityLogo)}
                         alt="Logo"
                         className="w-16 h-16 bg-gray-100 object-cover shadow-soft-sm rounded-xl"/>
                    <Typography variant="h5" className="text-gray-800 h-14 pt-2 overflow-hidden leading-6">
                      {community.name}
                    </Typography>
                  </div>

                  <Typography variant="small" className="h-20 overflow-hidden leading-5">
                    {community.description || "No community description."}
                  </Typography>
                </CardBody>

                <CardFooter divider className="flex items-center justify-between py-3">
                  <Typography variant="small">
                    ...
                  </Typography>
                  <div className="flex gap-1 text-gray-500 text-sm">
                    <i className="fas fa-map-marker-alt fa-sm mt-[3px]"/>
                    {isContractAddress(community.nftContract) && (
                      <Badge>NFT</Badge>
                    )}
                    {isContractAddress(community.ftContract) && (
                      <Badge>FT</Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            )) : (
              <p className={"text-gray-500"}>*No Communities</p>
            )}
          </div>

        </Container>
      </Wrapper>

      <Footer/>
    </div>
  )
};
