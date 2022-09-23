import React, { useEffect } from "react";
import { useContractRead, useNetwork } from "wagmi";
import { isContractAddress } from "../../utils/format";
import { transformCollectionNFT } from "../../utils/transform";
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { getTokenName } from "../../utils/settings";
import { useNavigate } from "react-router-dom";

export function NftList({ community }) {
  const navigate = useNavigate();
  const { chain } = useNetwork();

  const { data: collectionNFT } = useContractRead({
    addressOrName: community?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: community && isContractAddress(community?.nftContract),
    functionName: "getCollections",
    select: data => data.filter(c => c.distribution.distType > 0).map(collection => transformCollectionNFT(collection))
  });

  useEffect(() => {
    console.log(`collectionNFT`, collectionNFT);
  }, [ collectionNFT ])

  useEffect(() => {
    console.log(`community`, community);
  }, [ community ])

  return (
    <div className={"flex flex-wrap flex-row gap-6 justify-around"}>
      {(collectionNFT && collectionNFT.length > 0) ? collectionNFT.map(nft => (
        <Card className="w-64 border border-gray-100 mb-8 cursor-pointer hover:shadow-lg hover:border-gray-200 transition"
              key={nft.id}
              onClick={() => navigate(`/category/${community.category}/${community.id}/nft/${nft.id}`)}>

          <CardHeader color="blue" className="relative h-56">
            <img
              src={nft.mediaUri}
              alt="img-blur-shadow"
              className="h-full w-full"
            />
          </CardHeader>
          <CardBody className="text-gray-800 leading-5 font-medium text-center p-4">
            {nft.title}
          </CardBody>

          <CardFooter divider className="flex items-center justify-between py-3">
            <Typography variant="small">
              {nft.mintedTotal}{nft.supply === 0 ? "" : "/" + nft.supply} minted
            </Typography>
            <div className="flex gap-1 text-gray-500 text-sm">
              {parseFloat(nft.price) > 0 ? `${nft.price} ${getTokenName(chain)}` : "Free"}
            </div>
          </CardFooter>
        </Card>
      )) : (
        <div className={"text-center flex-auto"}>
          *No NFT Listed
        </div>
      )}
    </div>
  );
}
