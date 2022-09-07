import { createSlice } from "@reduxjs/toolkit";
import web3ContractAddress from '../contractsData/Web3Community-address.json';
import web3ContractABI from '../contractsData/Web3Community.json';
import { ethers } from 'ethers';

const contractSlice = createSlice({
  name: "contract",
  initialState: {
    contract: {},
  },
  reducers: {
    setContract(state, action) {

      state.contract = new ethers.Contract(
        web3ContractAddress.address,
        web3ContractABI.abi,
        action.payload.signer
      );
    },
  }
});

export const { setContract } = contractSlice.actions;
export default contractSlice.reducer;
