import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  isLoading: false,
  pageLoad: false,
};

export const baseSlice = createSlice({
  name: "base",
  initialState: INITIAL_STATE,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setPageLoad: (state, action) => {
      state.pageLoad = action.payload;
    }
  },
});

export const {
  setIsLoading,
  setPageLoad,
} = baseSlice.actions;

export default baseSlice.reducer;
