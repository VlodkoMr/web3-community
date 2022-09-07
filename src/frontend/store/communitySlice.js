import { createSlice } from "@reduxjs/toolkit";

const communitySlice = createSlice({
  name: "community",
  initialState: {
    current: null,
    list: [],
  },
  reducers: {
    setCommunityList(state, action) {
      state.list = action.payload.list;
    },
    setCurrentCommunity(state, action) {
      state.current = action.payload.id;
    },
  }
});

export const { setCommunityList, setCurrentCommunity } = communitySlice.actions;
export default communitySlice.reducer;
