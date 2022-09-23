import React, { useEffect, useState } from "react";
import { Textarea, Input, Button } from '@material-tailwind/react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Loader } from '../../Loader';
import { Popup } from '../../Popup';
import { Web3Provider } from "@ethersproject/providers";
import { useNetwork, useProvider } from "wagmi";
import { Framework } from "@superfluid-finance/sdk-core";
import { convertToEther } from "../../../utils/format";
import { BigNumber } from "ethers";

export function AirdropFTPopup(
  {
    popupVisible,
    setPopupVisible,
    handleSuccess,
    tokenSymbol,
    tokenAddress,
    myBalance,
  }) {
  const provider = useProvider();
  const { chain } = useNetwork();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isSuccess, setIsSuccess ] = useState(false);
  const [ formData, setFormData ] = useState({
    whitelisted: "",
    tokensAmount: "",
  });

  const addressCount = () => {
    let count = 0;
    formData.whitelisted.replace("\n", ",").split(",").map(address => {
      if (address.length > 3) {
        count++;
      }
    });
    return count;
  }

  const tokensPerUser = () => {
    const totalTokens = parseInt(formData.tokensAmount);
    const count = addressCount();
    if (count > 0) {
      return parseInt(totalTokens / count || "0");
    }
    return 0;
  }


  const sendAirdrop = () => {
    setIsLoading(true);

    return new Promise(async (resolve, reject) => {
      const id = Math.floor(Math.random() * 1000000000);
      const sf = await Framework.create({
        chainId: chain.id,
        provider
      });

      const metamaskProvider = new Web3Provider(window.ethereum);
      const mySigner = sf.createSigner({ web3Provider: metamaskProvider });

      // ----- Create -----

      try {
        const createIndexOperation = sf.idaV1.createIndex({
          indexId: id,
          superToken: tokenAddress
        });
        await createIndexOperation.exec(mySigner);
      } catch (error) {
        console.log(`index err`);
        console.error(error);
        reject();
      }

      // ----- Add recipient -----

      try {
        await Promise.all(
          formData.whitelisted.replace("\n", ",").split(",").map(async address => {
            if (address.length > 3) {
              const updateSubscriptionOperation = await sf.idaV1.updateSubscriptionUnits({
                indexId: id,
                superToken: tokenAddress,
                subscriber: address,
                units: "1"
              });
              return await updateSubscriptionOperation.exec(mySigner);
            }
          })
        );
      } catch (error) {
        console.error(error);
        reject();
      }

      // ----- Send -----

      try {
        console.log(`Start distribution...`);
        const distributeOperation = sf.idaV1.distribute({
          indexId: id,
          superToken: tokenAddress,
          amount: convertToEther(formData.tokensAmount)
        });
        await distributeOperation.exec(mySigner);

        // Success distribution
        console.log(` Success distribution!`);
        resolve();
      } catch (error) {
        console.error(error);
        reject();
      }
    })
  }

  const handleSendAirdrop = (e) => {
    e.preventDefault();

    if (addressCount() < 1) {
      alert("Please provide address list separated by coma");
      return false;
    }
    if (tokensPerUser() < 1) {
      alert("Please provide correct amount of tokens for airdrop");
      return false;
    }
    if (BigNumber.from(myBalance).lt(BigNumber.from(formData.tokensAmount))) {
      alert("Not enough tokens");
      return false;
    }

    sendAirdrop().then(() => {
      setIsLoading(false);
      setIsSuccess(true);
      handleSuccess?.();
    }).catch(e => {
      setIsLoading(false);
      alert('Error, please try one mo time');
    });
  }

  useEffect(() => {
    if (!popupVisible) {
      setIsLoading(false);
      setIsSuccess(false);
      setFormData({
        whitelisted: "",
        tokensAmount: "",
      });
    }
  }, [ popupVisible ]);

  return (
    <>
      <Popup title="New Token Airdrop"
             isVisible={popupVisible}
             size={"lg"}
             setIsVisible={setPopupVisible}>
        {!isSuccess ? (
          <form className="flex flex-row gap-10 relative" onSubmit={handleSendAirdrop}>
            <div className="w-1/3">

              <div className={"mt-4 bg-yellow-50 px-4 py-4 rounded-md border border-orange-200 "}>
                <Input type="number"
                       label={`Total ${tokenSymbol} Amount*`}
                       className="flex-1 bg-white"
                       required={true}
                       maxLength={50}
                       value={formData.tokensAmount}
                       onChange={(e) => setFormData({ ...formData, tokensAmount: e.target.value })}
                />
                <div className="mt-4 text-sm font-medium flex justify-between">
                  <p>Tokens per address: <b>{tokensPerUser()} {tokenSymbol}</b></p>
                  <span onClick={() => alert("coming soon. You will be able to set tokens amount for each address!")}
                        className={"underline text-blue-500 text-sm cursor-pointer"}>
                    manage
                </span>
                </div>
              </div>

              <div className={"text-center text-sm"}>
                <div className={"mt-6 mb-1"}>Airdrop by:</div>
                <a href="https://www.superfluid.finance/" target={"_blank"}>
                  <img src={require("../../../assets/images/logo/superfluid.svg")} alt="" className={"h-10  mx-auto"}/>
                </a>
              </div>
            </div>

            <div className={"w-2/3 text-sm"}>
              <Textarea label="List of Wallet addresses:"
                        variant={"static"}
                        className={"h-48 bg-gray-50 p-6 mt-4"}
                        placeholder="Wallet addresses separated by coma"
                        onChange={(e) => setFormData({ ...formData, whitelisted: e.target.value })}
                        value={formData.whitelisted}
              />
              <div className={"flex justify-between mt-4"}>
                <div className={"pt-2"}>
                  Total Addresses: <b>{addressCount()}</b>
                </div>
                <Button type="Submit" variant="gradient">
                  Send Airdrop
                  <MdKeyboardArrowRight className="text-lg align-bottom ml-1 inline-block"/>
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="bg-white/80 absolute top-[-20px] bottom-0 right-0 left-0 z-10">
                <div className={"w-12 mx-auto mt-10"}>
                  <Loader/>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className={"text-center font-medium py-16 text-green-500 text-xl"}>
            Airdrop successfully Sent!
          </div>
        )}
      </Popup>
    </>
  );
}
