import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Currency } from "./currenciesSlices";

// =============================================================================
// ============================== CONSTANTS ====================================
// =============================================================================

export class Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category?: string;
  image?: string;

  /**
   * Converts a price into a given currency. If no currency if provided the price
   * is return as it is.
   * 
   * @param price The price ot be converted into a given currency. 
   * @param currency The currency to convert the price into.
   */
  static formatPrice(price: number, currency: Currency): string {
    // Default is USD.
    if (!currency) {
      return `$${price}`;
    }
    // Convert and round the price.
    const newPrice = (price * currency.rate).toFixed(currency.precision);
    // Place the currency symbol right position.
    return currency.position === "prefix"
      ? `${currency.symbol} ${newPrice}`
      : `${newPrice} ${currency.symbol}`;
  }
}

// =============================================================================
// ============================== REDUX THUNKS =================================
// =============================================================================

type QueryParams = {
  count?: number;
  id?: number | string;
} | undefined;

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async ({ count }: QueryParams, thunkAPI) => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products", {
        params: count ? { limit: count } : {},
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async ({ id }: QueryParams, thunkAPI) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// =============================================================================
// ============================== REDUCERS =====================================
// =============================================================================

export const productsAdapter = createEntityAdapter<Product>();
export const slice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState(),
  reducers: {
    removeProduct: productsAdapter.removeOne,
  },
  extraReducers: builder => {
    builder.addCase(fetchProducts.fulfilled, productsAdapter.upsertMany);
    builder.addCase(fetchProductById.fulfilled, productsAdapter.addOne);
  }
});

// =============================================================================
// ============================== EXPORTS ======================================
// =============================================================================

const reducer = slice.reducer;
export default reducer;

export const {
  removeProduct,
} = slice.actions;

export const {
  selectById: selectProductById,
  selectIds: selectProductIds,
  selectEntities: selectProductEntities,
  selectAll: selectAllProducts,
  selectTotal: selectTotalProducts
} = productsAdapter.getSelectors<RootState>((state) => state.products);