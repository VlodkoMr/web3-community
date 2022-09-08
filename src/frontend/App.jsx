import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Home, Community, Error404, FungibleToken, NftCollection, Settings } from './pages';
import { useAccount, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { Transaction } from './components/Transaction';
import { useSelector } from 'react-redux';
import web3ContractAddress from './contractsData/Web3Community-address.json';
import web3ContractABI from './contractsData/Web3Community.json';

export default function App() {
  const transactions = useSelector(state => state.transactions.list);
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [contract, setContract] = useState();

  useEffect(() => {
    if (isConnected && signer) {
      const contract = new ethers.Contract(
        web3ContractAddress.address,
        web3ContractABI.abi,
        signer
      );
      setContract(contract);
    }
  }, [isConnected, signer]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home contract={contract} />} />
          <Route exact path="/community" element={<Community contract={contract} />}>
            <Route exact path="dashboard" element={<Dashboard contract={contract} />} />
            <Route exact path="nft" element={<NftCollection contract={contract} />} />
            <Route exact path="token" element={<FungibleToken contract={contract} />} />
            <Route exact path="settings" element={<Settings contract={contract} />} />
          </Route>
          <Route path='*' element={<Error404 contract={contract} />} />
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
