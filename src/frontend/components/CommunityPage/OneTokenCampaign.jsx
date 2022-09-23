import React, { useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { convertFromEther, formatNumber, isContractAddress, timestampToDate } from "../../utils/format";
import { Button, Input } from "@material-tailwind/react";
import { emailRegex } from "../../utils/settings";
import { defaultAbiCoder as abi } from "@ethersproject/abi/lib/abi-coder";
import { WorldIDWidget } from "@worldcoin/id";
import { addTransaction } from "../../store/transactionSlice";
import { useDispatch } from "react-redux";
import FungibleTokenABI from "../../contractsData/FungibleToken.json";

export function OneTokenCampaign({ community, campaign, tokenSymbol, ftCampaignTitles, onSuccess }) {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const [ worldIDProof, setWorldIDProof ] = React.useState(null);
  const [ claimFormData, setClaimFormData ] = useState({});
  const [ formData, setFormData ] = useState({
    ready: false,
    email: "",
    eventCode: "",
  });

  // -------- Get FT Claimed ---------

  const { data: ftClaimed, error: errorClaimed, isSuccess: isCheckSuccess } = useContractRead({
    addressOrName: community?.ftContract,
    contractInterface: FungibleTokenABI.abi,
    enabled: community && isContractAddress(community?.ftContract),
    functionName: "mintedList",
    args: [ campaign.id, address ],
    watch: true
  });


  useEffect(() => {
    console.log(`ftClaimed`, ftClaimed);
  }, [ ftClaimed ]);

  useEffect(() => {
    console.log(`isCheckSuccess`, isCheckSuccess);
  }, [ isCheckSuccess ]);

  // -------- Claim ---------

  const getABIEncodedProof = () => {
    if (worldIDProof?.proof) {
      return abi.decode([ "uint256[8]" ], worldIDProof?.proof)[0];
    }
    return [ 0, 0, 0, 0, 0, 0, 0, 0 ];
  }

  const { config: configClaim, error: errorClaim } = usePrepareContractWrite({
    addressOrName: community?.ftContract,
    contractInterface: FungibleTokenABI.abi,
    enabled: claimFormData && !!claimFormData.ready,
    functionName: 'claimFromCampaign',
    args: [ community?.id, campaign?.id, claimFormData.eventCode, claimFormData.email,
      worldIDProof?.merkle_root || 0, worldIDProof?.nullifier_hash || 0, getABIEncodedProof()
    ],
  });

  const { data: claimData, write: claimWrite, status: claimWriteStatus } = useContractWrite({
    ...configClaim,
    onSuccess: ({ hash }) => {
      dispatch(addTransaction({
        hash: hash,
        description: `Claim Tokens`
      }));
    },
    onError: ({ message }) => {
      console.log('onError message', message);
      setClaimFormData({});
    },
  });

  useWaitForTransaction({
    hash: claimData?.hash,
    onError: error => {
      console.log('is err', error);
      setClaimFormData({});
    },
    onSuccess: data => {
      if (data) {
        console.log('data', data);
        setClaimFormData({});
        onSuccess?.();
      }
    },
  });

  useEffect(() => {
    console.log(`claimWrite`, claimWrite);
    if (claimWrite && claimWriteStatus !== 'loading') {
      claimWrite();
    }
  }, [ claimWrite ]);

  // -------- Actions ---------

  const isWhitelisted = () => {
    return campaign.whitelist.indexOf(address) !== -1;
  }

  const handleClaim = () => {
    const error = claimError();
    if (!error) {
      setClaimFormData({
        ready: true,
        eventCode: parseInt(formData.eventCode || "0"),
        email: formData.email,
      });
    } else {
      alert(error);
    }
  }

  const claimError = () => {
    let result = true;
    if (campaign.distType === 2) {
      if (!isWhitelisted()) {
        return "You not whitelisted";
      }
    }
    if (campaign.distType === 3) {
      if (!formData.email.match(emailRegex)) {
        return "Please provide your email";
      }
    }
    if (campaign.distType === 4) {
      if (campaign.eventCode.toString() !== formData.eventCode) {
        return "Wrong event Code";
      }
    }

    if (result && campaign.worldcoinAction.length > 0) {
      if (!worldIDProof) {
        return "World ID proof is missing";
      }
    }

    const now = +new Date();
    if (campaign.dateStart > 0 && now < campaign.dateStart) {
      return "Minting period not started";
    }
    if (campaign.dateEnd > 0 && campaign.dateEnd < now) {
      return "Minting period ends";
    }

    return false;
  }

  return (
    <div className={"border rounded-lg mb-2 px-6 py-3 bg-gray-50"}>
      <div className={"font-medium text-gray-800 flex justify-between mb-2"}>
        <span>{ftCampaignTitles[campaign.distType]}</span>
        <div className={"text-right"}>
          {campaign.dateStart > 0 && campaign.dateEnd > 0 && (
            <small className={"text-right text-gray-500 pt-0.5"}>
              {timestampToDate(campaign.dateStart)} - {timestampToDate(campaign.dateEnd)}
            </small>
          )}
          <div>
            {formatNumber(convertFromEther(campaign.tokensMinted))}
            <span className={"mx-1"}>/</span>
            {formatNumber(convertFromEther(campaign.tokensTotal, 0))} {tokenSymbol}
          </div>
        </div>
      </div>

      <div>
        {campaign.distType === 3 && (
          <div className={"flex flex-row gap-4 mt-2"}>
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
        {campaign.distType === 4 && (
          <div className={"flex flex-row gap-4 mt-2"}>
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

        {campaign.worldcoinAction.length > 0 && (
          <div className={"mt-2 ml-2"}>
            <WorldIDWidget
              actionId={campaign.worldcoinAction}
              signal="my_signal"
              enableTelemetry
              onSuccess={(verificationResponse) => {
                console.log('verificationResponse', verificationResponse);
                setWorldIDProof(verificationResponse);
              }} // pass the proof to the API or your smart contract
              onError={(error) => console.error(error)}
              debug={true} // to aid with debugging, remove in production
            />
          </div>
        )}

        {isCheckSuccess && (
          <>
            {ftClaimed ? (
              <div className={
                "pt-3 mt-4 border-t text-center font-medium text-green-500"
              }>
                Tokens Claimed!
              </div>
            ) : (
              <Button variant={"outlined"}
                      disabled={claimError()}
                      onClick={handleClaim}
                      className={"w-full mt-2"}>Claim</Button>
            )}
          </>
        )}

      </div>
    </div>
  );
}
