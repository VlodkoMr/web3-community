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
  }
});

export const { setCommunityList } = communitySlice.actions;
export default communitySlice.reducer;
