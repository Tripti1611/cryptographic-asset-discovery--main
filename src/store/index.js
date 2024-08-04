import { configureStore } from "@reduxjs/toolkit";
import baseReducer from "./reducers/baseReducers.js";

const store = configureStore(
  {reducer:{
  base: baseReducer
}});

export default store;
