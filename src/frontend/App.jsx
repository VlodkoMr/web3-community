import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Home, Community, Error404, FungibleToken, NftCollection, Settings } from './pages';
import { useAccount } from 'wagmi'

import { Transaction } from './components/Transaction';
import { useSelector } from 'react-redux';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { isConnected } = useAccount();
  const transactions = useSelector(state => state.transactions.list);

  useAccount({
    onDisconnect() {
      localStorage.removeItem("communityId");
      document.location.href = "/";
    }
  });

  useEffect(() => {
    if (isConnected || document.location.pathname === "/") {
      setIsReady(true);
    } else {
      document.location.href = "/";
    }
  }, [isConnected])

  return (
    <>
      <BrowserRouter>
        {isReady && (
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/my" element={<Community />}>
              <Route exact path="dashboard" element={<Dashboard />} />
              <Route exact path="nft" element={<NftCollection />} />
              <Route exact path="token" element={<FungibleToken />} />
              <Route exact path="settings" element={<Settings />} />
            </Route>
            <Route path='*' element={<Error404 />} />
          </Routes>
        )}
      </BrowserRouter>

      {transactions.length > 0 && (
        <div className="fixed z-60 right-0 top-0 w-[420px] pr-5 pt-5">
          {transactions.map(tx => (
            <Transaction tx={tx} key={tx.hash} />
          ))}
        </div>
      )}
    </>
  )
}
