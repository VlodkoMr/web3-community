import React, { useEffect, useState } from "react";
import { Container, InnerBlock } from "../../assets/css/common.style";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Input } from "@material-tailwind/react";
import { communityTypes, getTokenName } from "../../utils/settings";
import { useContractRead, useNetwork } from "wagmi";
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import { isContractAddress } from "../../utils/format";
import { transformCollectionNFT } from "../../utils/transform";

export const NFTDetails = () => {
  const { chain } = useNetwork();
  const [ community ] = useOutletContext();
  const [ formData, setFormData ] = useState({
    email: "",
    eventCode: "",
  });
  let { nftId } = useParams();

  const { data: nft, error } = useContractRead({
    addressOrName: community?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: community && isContractAddress(community?.nftContract),
    functionName: "collections",
    args: [ parseInt(nftId) - 1 ],
    select: data => transformCollectionNFT(data)
  });

  useEffect(() => {
    console.log('nft', nft);
  }, [ nft ]);

  const mintNFT = (e) => {
    e.preventDefault();

  }

  return (
    <Container className={"relative"}>
      <Container className={"mb-6"}>
        <Breadcrumbs>
          <Link to="/">Home</Link>
          <Link to={`/category/${community.category}`}>{communityTypes[community.category - 1]}</Link>
          <Link to={`/category/${community.category}/${community.id}`}>{community.name}</Link>
        </Breadcrumbs>
      </Container>

      {nft && nft.distribution ? (
        <div className={"flex flex-row gap-10"}>
          <div className={"w-1/2 mb-10"}>
            <InnerBlock>
              <img src={nft.mediaUri} alt={`NFT ${nft.title}`} className={"bg-gray-100 rounded-lg my-2"}/>
            </InnerBlock>
          </div>
          <div className={"w-1/2"}>
            <h1 className={"text-3xl font-semibold text-gray-800 pt-8 mb-4"}>{nft.title}</h1>
            <p className={"pr-8"}>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even slightly believable.
            </p>
            <div className={"mt-6"}>
              Minted: <b>{nft.mintedTotal}{nft.supply === 0 ? "" : "/" + nft.supply} NFT</b>
            </div>
            <div>
              Price: <b>{parseFloat(nft.price) > 0 ? `${nft.price} ${getTokenName(chain)}` : "Free"}</b>
            </div>

            {nft.distribution.isProtected && (
              <></>
            )}

            <form onSubmit={mintNFT} className={"flex flex-row gap-4 mt-6"}>
              {nft.distribution.distType === 2 && (
                <>whitelisted?</>
              )}
              {nft.distribution.distType === 3 && (
                <div className={"w-48"}>
                  <Input type="email"
                         label="Your Email*"
                         size={"lg"}
                         required={true}
                         value={formData.email}
                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              )}
              {nft.distribution.distType === 4 && (
                <div className={"w-48"}>
                  <Input type="number"
                         label="Event Code*"
                         size={"lg"}
                         required={true}
                         value={formData.eventCode}
                         onChange={(e) => setFormData({ ...formData, eventCode: e.target.value })}
                  />
                </div>
              )}
              <Button className={"w-36 -mt-0.5"} color={"indigo"} size={"lg"}>MINT NFT</Button>
            </form>

          </div>
        </div>
      ) : (
        <div className={"text-center"}>
          <div>
            <b>*NFT Not Found</b>
          </div>
          <Link className={"underline mt-2"} to={`/category/${community.category}/${community.id}`}>Back to Community</Link>
        </div>
      )}
    </Container>
  );
}
