import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loader",
  initialState: {
    showLoading: false,
    hideLoading: false,
  },
  reducers: {
    SetShowLoading(state, action) {
      state.showLoading = action.payload;
    },
    SetHideLoading(state, action) {
      state.hideLoading = action.payload;
    },
  },
});

export const { SetShowLoading, SetHideLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
