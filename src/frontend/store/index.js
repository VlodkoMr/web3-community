import { configureStore } from "@reduxjs/toolkit";
import communitySlice from './communitySlice';
import transactionSlice from './transactionSlice';

export default configureStore({
  reducer: {
    community: communitySlice,
    transactions: transactionSlice,
  }
});
