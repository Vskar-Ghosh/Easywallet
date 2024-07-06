import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import loadingSlice from "./loadingSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    loader: loadingSlice,
  },
});
export default store;
