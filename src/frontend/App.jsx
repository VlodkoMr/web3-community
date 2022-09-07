import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Home } from './pages';
import { Error404 } from './pages/Error404';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi'
import { useDispatch } from "react-redux";

export default function App() {
  const [contract, setContract] = useState();
  const { data: signer } = useSigner();
  const dispatch = useDispatch();

  useEffect(() => {

    // const contract = new ethers.Contract(
    //   web3ContractAddress.address,
    //   web3ContractABI.abi,
    //   signer
    // );
    // console.log('contract', contract);
    // setContract(contract);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={<Home  />}
        />
        <Route
          exact
          path="/dashboard"
          element={<Dashboard contract={contract} />}
        />
        <Route
          path='*'
          element={<Error404 />}
        />
      </Routes>
    </BrowserRouter>
  )
}
