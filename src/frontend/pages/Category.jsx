import React, { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Container, Wrapper } from "../assets/css/common.style";
import { useParams } from "react-router-dom";
import { useContractRead } from "wagmi";
import { transformCommunity } from "../utils/transform";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { mainContract } from "../utils/contracts";

export const Category = () => {
  let { id } = useParams();


  const { data: communities, error: err } = useContractRead({
    ...mainContract,
    enabled: !!id,
    functionName: "getCategoryCommunities",
    select: data => data.map(community => transformCommunity(community)),
    args: [ id ]
  })

  useEffect(() => {
    console.log(`communities`, communities);
  }, [ communities ])

  useEffect(() => {
    console.log(`err`, err);
  }, [ err ])

  return (
    <div className="flex flex-col h-screen relative">
      <Header/>
      <div id="home" className="relative h-[80px] bg-primary mb-6"/>

      <Wrapper>
        <Container className="flex flex-row">
          <h3>{id}</h3>


          <Card className="w-96">
            <CardHeader color="blue" className="relative h-56">
              <img
                src="/img/blog.jpg"
                alt="img-blur-shadow"
                className="h-full w-full"
              />
            </CardHeader>
            <CardBody className="text-center">
              <Typography variant="h5" className="mb-2">
                Cozy 5 Stars Apartment
              </Typography>
              <Typography>
                The place is close to Barceloneta Beach and bus stop just 2 min by
                walk and near to "Naviglio" where you can enjoy the main night life in
                Barcelona.
              </Typography>
            </CardBody>
            <CardFooter divider className="flex items-center justify-between py-3">
              <Typography variant="small">$899/night</Typography>
              <Typography variant="small" color="gray" className="flex gap-1">
                <i className="fas fa-map-marker-alt fa-sm mt-[3px]"/>
                Barcelona, Spain
              </Typography>
            </CardFooter>
          </Card>


        </Container>
      </Wrapper>

      <Footer/>
    </div>
  )
};
