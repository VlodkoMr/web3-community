import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Category, Home, Error404, CommunityPageLayout,
  MyCommunityLayout, MyDashboard, FungibleToken, NftCollection, Settings, DAO, Members, Video, Dashboard, NFTDetails
} from './pages';
import { useAccount } from 'wagmi'
import { Transaction } from './components/Transaction';
import { useSelector } from 'react-redux';

export default function App() {
  const [ isReady, setIsReady ] = useState(false);
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
  }, [ isConnected ])

  return (
    <>
      <BrowserRouter>
        {isReady && (
          <Routes>
            <Route exact path="/" element={<Home/>}/>

            <Route exact path="/my" element={<MyCommunityLayout/>}>
              <Route exact path="dashboard" element={<MyDashboard/>}/>
              <Route exact path="nft" element={<NftCollection/>}/>
              <Route exact path="token" element={<FungibleToken/>}/>
              <Route exact path="settings" element={<Settings/>}/>
              <Route exact path="video" element={<Video/>}/>
              <Route exact path="dao" element={<DAO/>}/>
              <Route exact path="members" element={<Members/>}/>
            </Route>

            <Route exact path="/category/:categoryId" element={<Category/>}/>
            <Route exact path="/category/:categoryId/:communityId" element={<CommunityPageLayout/>}>
              <Route exact path="" element={<Dashboard/>}/>
              <Route exact path="nft/:nftId" element={<NFTDetails/>}/>
            </Route>

            <Route path='*' element={<Error404/>}/>
          </Routes>
        )}
      </BrowserRouter>

      {transactions.length > 0 && (
        <div className="fixed z-100 right-0 top-0 w-[420px] pr-5 pt-5">
          {transactions.map(tx => (
            <Transaction tx={tx} key={tx.hash}/>
          ))}
        </div>
      )}
    </>
  )
}
