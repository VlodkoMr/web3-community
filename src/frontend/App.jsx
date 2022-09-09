import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Home, Community, Error404, FungibleToken, NftCollection, Settings } from './pages';
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { Spinner } from 'flowbite-react';
import { Transaction } from './components/Transaction';
import { useSelector } from 'react-redux';
import mainContractAddress from './contractsData/MainContract-address.json';
import mainContractABI from './contractsData/MainContract.json';
import factoryContractAddress from './contractsData/FactoryContract-address.json';
import factoryContractABI from './contractsData/FactoryContract.json';

export default function App() {
  // const [isReady, setIsReady] = useState(false);
  const transactions = useSelector(state => state.transactions.list);
  useAccount({
    onDisconnect() {
      localStorage.removeItem("communityId");
    }
  });

  // const { data: signer } = useSigner();
  // useEffect(() => {
  //   if (isConnected) {
  //     console.log('signer', signer);
  //
  //     window.contracts = {
  //       main: new ethers.Contract(
  //         mainContractAddress.address,
  //         mainContractABI.abi,
  //         signer
  //       ),
  //       factory: new ethers.Contract(
  //         factoryContractAddress.address,
  //         factoryContractABI.abi,
  //         signer
  //       ),
  //     }
  //     setIsReady(true);
  //   } else if (isDisconnected) {
  //     setIsReady(true);
  //   }
  //
  //   console.log('isConnected', isConnected);
  //   console.log('isDisconnected', isDisconnected);
  // }, [isConnected, isDisconnected]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/community" element={<Community />}>
            <Route exact path="dashboard" element={<Dashboard />} />
            <Route exact path="nft" element={<NftCollection />} />
            <Route exact path="token" element={<FungibleToken />} />
            <Route exact path="settings" element={<Settings />} />
          </Route>
          <Route path='*' element={<Error404 />} />
        </Routes>
      </BrowserRouter>

      {transactions.length > 0 && (
        <div className="absolute z-60 right-0 top-0 w-[420px] pr-5 pt-5">
          {transactions.map(tx => (
            <Transaction tx={tx} key={tx.hash} />
          ))}
        </div>
      )}
    </>
  )
}
