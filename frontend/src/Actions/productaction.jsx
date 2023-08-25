import { createAsyncThunk } from "@reduxjs/toolkit";

export const getalldata = createAsyncThunk("products", async () => {
  try {
    const response = await fetch("http://localhost:4000/api/v1/products");
    const result = await response.json();
    console.log("Fetched data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
});
// fetching product by id
const fetchProductDetails = async (id) => {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/products/${id}`);
    const result = await response.json();
    console.log("Fetched data:", result);
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Create the async thunk using the payload creator function
export const getproductdetails = createAsyncThunk(
  "productdetails",
  async (id) => {
    return fetchProductDetails(id);
  }
);
