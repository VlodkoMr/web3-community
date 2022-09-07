import { configureStore } from "@reduxjs/toolkit";
import communitySlice from './communitySlice';
import contractSlice from './contractSlice';

export default configureStore({
  reducer: {
    contract: contractSlice,
    community: communitySlice,
  }
});
