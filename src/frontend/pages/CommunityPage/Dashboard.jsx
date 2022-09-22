import React, { useEffect } from "react";
import { NftList } from "../../components/CommunityPage/NftList";
import { Container, InnerBlock } from "../../assets/css/common.style";
import { Link, useOutletContext } from "react-router-dom";
import { Breadcrumbs } from "@material-tailwind/react";
import { communityTypes } from "../../utils/settings";

export const Dashboard = () => {
  const [ community ] = useOutletContext();

  useEffect(() => {
    console.log('community', community);
  }, [ community ]);

  return (
    <>
      <Container className={"relative flex flex-row gap-6"}>
        <div className={"w-2/3"}>
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

        <InnerBlock className={"w-1/3"}>
          <div>
            <h3 className={"text-lg font-semibold text-gray-800 mb-4"}>XXX Token</h3>
            <p>...</p>
          </div>
        </InnerBlock>
      </Container>

    </>
  );
}
