import { createSlice } from "@reduxjs/toolkit";
import { getalldata, getproductdetails } from "../Actions/productaction";

// Create products slice using createSlice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getalldata.pending, (state) => {
        state.loading = true;
      })
      .addCase(getalldata.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getalldata.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Create productdetails slice using createSlice
const productdetailsSlice = createSlice({
  name: "productdetails",
  initialState: {
    product: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getproductdetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getproductdetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getproductdetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export both slices as named exports
export const productsReducer = productsSlice.reducer;
export const productDetailsReducer = productdetailsSlice.reducer;
