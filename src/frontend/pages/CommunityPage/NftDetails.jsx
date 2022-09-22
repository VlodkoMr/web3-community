import React, { useEffect, useState } from "react";
import { Container, InnerBlock } from "../../assets/css/common.style";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Input } from "@material-tailwind/react";
import { communityTypes, getTokenName } from "../../utils/settings";
import { useAccount, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import NFTCollectionABI from "../../contractsData/NFTCollection.json";
import { convertToEther, isContractAddress, timestampToDate } from "../../utils/format";
import { transformCollectionNFT } from "../../utils/transform";
import { WorldIDWidget } from "@worldcoin/id";
import { addTransaction } from "../../store/transactionSlice";
import { defaultAbiCoder as abi } from "@ethersproject/abi";
import { useDispatch } from "react-redux";
import { BigNumber } from "ethers";

export const NFTDetails = () => {
  const dispatch = useDispatch();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [ community ] = useOutletContext();
  const [ mintFormData, setMintFormData ] = useState({});
  const [ formData, setFormData ] = useState({
    amount: "1",
    email: "",
    eventCode: "",
  });
  let { nftId } = useParams();
  const [ worldIDProof, setWorldIDProof ] = React.useState(null);

  // ----------- Get NFT Details ----------

  const { data: nft, error } = useContractRead({
    addressOrName: community?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: community && isContractAddress(community?.nftContract),
    functionName: "collections",
    args: [ parseInt(nftId) - 1 ],
    select: data => transformCollectionNFT(data)
  });

  // -------------- Claim NFT -------------

  const getABIEncodedProof = () => {
    if (worldIDProof?.proof) {
      return abi.decode([ "uint256[8]" ], worldIDProof?.proof)[0];
    }
    return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  }

  const getMintPrice = () => {
    if (mintFormData?.amount) {
      const priceOne = convertToEther(nft.price);
      return priceOne.mul(BigNumber.from(mintFormData?.amount));
    }
    return 0;
  }

  const { config: configMint, error: errorMint } = usePrepareContractWrite({
    addressOrName: community?.nftContract,
    contractInterface: NFTCollectionABI.abi,
    enabled: mintFormData?.amount > 0,
    functionName: 'payToMint',
    args: [ nft?.id, mintFormData.amount, mintFormData.eventCode, mintFormData.email,
      worldIDProof?.merkle_root || 0, worldIDProof?.nullifier_hash || 0, getABIEncodedProof()
    ],
    overrides: {
      from: address,
      value: getMintPrice(),
    },
  });

  const { data: mintData, write: mintWrite, status: mintWriteStatus } = useContractWrite({
    ...configMint,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Mint NFT`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setMintFormData({});
    },
  });

  useWaitForTransaction({
    hash: mintData?.hash,
    onError: error => {
      console.log('is err', error);
      setMintFormData({});
    },
    onSuccess: data => {
      if (data) {
        console.log('data', data);
        setMintFormData({});
      }
    },
  });

  useEffect(() => {
    console.log(`mintWrite`, mintWrite);
    if (mintWrite && mintWriteStatus !== 'loading') {
      mintWrite();
    }
  }, [ mintWrite ]);


  useEffect(() => {
    console.log(`errorMint`, errorMint);
  }, [ errorMint ]);

  useEffect(() => {
    console.log(`mintFormData`, mintFormData);
  }, [ mintFormData ]);


  useEffect(() => {
    console.log(`nft`, nft);
  }, [ nft ]);

  const isWhitelisted = () => {
    return nft.distribution.whitelist.indexOf(address) !== -1;
  }
  const mintNFTError = () => {
    let result = true;
    if (nft.distribution.distType === 2) {
      if (!isWhitelisted()) {
        return "You not whitelisted";
      }
    }
    if (nft.distribution.distType === 3) {
      const validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!formData.email.match(validRegex)) {
        return "Please provide your email";
      }
    }
    if (nft.distribution.distType === 4) {
      if (nft.distribution.eventCode.toString() !== formData.eventCode) {
        return "Wrong event Code";
      }
    }

    if (result && nft.distribution.worldcoinAction.length > 0) {
      if (!worldIDProof) {
        return "World ID proof is missing";
      }
    }

    return false;
  }

  const mintNFT = (e) => {
    const error = mintNFTError();
    if (!error) {
      setMintFormData({
        amount: parseInt(formData.amount),
        eventCode: parseInt(formData.eventCode || "0"),
        email: formData.email,
      });
    } else {
      alert(error);
    }
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
            <h1 className={"text-3xl font-semibold text-gray-800 pt-8 pr-4"}>{nft.title}</h1>

            <p className={"pr-8 mt-6"}>
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even slightly believable.
            </p>
            <div className={"mt-6"}>
              Minted: <b className={"font-medium text-gray-700"}>
              {nft.mintedTotal}{nft.supply === 0 ? "" : "/" + nft.supply} NFT
            </b>
            </div>
            <div>
              {nft.distribution.dateStart > 0 && nft.distribution.dateEnd > 0 && (
                <>
                  Available: <b className={"font-medium text-gray-700"}>
                  {timestampToDate(nft.distribution.dateStart)} - {timestampToDate(nft.distribution.dateEnd)}
                </b>
                </>
              )}
            </div>
            <div>
              Price: <b className={"font-medium text-gray-700"}>
              {parseFloat(nft.price) > 0 ? `${nft.price} ${getTokenName(chain)}` : "Free"}
            </b>
            </div>

            <div className={"p-6 bg-white/50 border border-blue-100/50 rounded-lg mt-6 mr-12 shadow-gray-300/50 shadow-lg"}>
              {nft.distribution.distType === 2 && (
                <>{isWhitelisted() ? (
                  <div className="text-blue-600 text-center border-b pb-4 pt-1 font-semibold">
                    Great, your wallet address in whitelist!
                  </div>
                ) : (
                  <div className="text-red-400 text-center border-b pb-4 pt-1 font-semibold">
                    No Access to mint - your wallet not found in whitelist.
                  </div>
                )}</>
              )}

              <div>
                {nft.distribution.distType === 3 && (
                  <div className={"flex flex-row gap-4"}>
                <span className={"text-sm leading-4 text-right pt-2"}>
                Confirm your email to mint NFT:
                </span>
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
                  <div className={"flex flex-row gap-4"}>
                <span className={"text-sm leading-4 text-right pt-2"}>
                Provide 6-digits code to mint NFT:
                </span>
                    <Input type="number"
                           label="Event Code*"
                           size={"lg"}
                           required={true}
                           value={formData.eventCode}
                           onChange={(e) => setFormData({ ...formData, eventCode: e.target.value })}
                    />
                  </div>
                )}

                <div className={"flex justify-between flex-row gap-6 mt-6"}>
                  {nft.distribution.worldcoinAction.length > 0 && (
                    <WorldIDWidget
                      actionId={nft.distribution.worldcoinAction}
                      signal="my_signal"
                      enableTelemetry
                      onSuccess={(verificationResponse) => {
                        console.log('verificationResponse', verificationResponse);
                        setWorldIDProof(verificationResponse);
                      }} // pass the proof to the API or your smart contract
                      onError={(error) => console.error(error)}
                      debug={true} // to aid with debugging, remove in production
                    />
                  )}
                  <Button className={"flex-auto -mt-0.5"}
                          color={"indigo"}
                          onClick={() => mintNFT()}
                          disabled={!!mintNFTError()}
                          size={"lg"}>
                    MINT NFT
                  </Button>
                </div>

              </div>
            </div>
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
