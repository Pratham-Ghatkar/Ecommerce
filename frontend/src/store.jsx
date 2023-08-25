import { configureStore } from "@reduxjs/toolkit";
import {
  productDetailsReducer,
  productsReducer,
} from "./reducers/productslice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    productDetails: productDetailsReducer,
  },
});

export default store;
