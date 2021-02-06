import {
    createAsyncThunk,
    createEntityAdapter, createSlice, PayloadAction
} from '@reduxjs/toolkit';
import axios from "axios";
import { RootState } from '../store';

// =============================================================================
// ============================== CONSTANTS ====================================
// =============================================================================

const mapUnitSymbols = {
    EUR: { unit: "EUR", position: "suffix", symbol: "€", precision: 2 },
    GBP: { unit: "GBP", position: "prefix", symbol: "£", precision: 2 },
    JPY: { unit: "JPY", position: "prefix", symbol: "¥", precision: 0 },
    USD: { unit: "USD", position: "prefix", symbol: "$", precision: 2 },
};

export type Currency = {
    id: number;
    unit: "EUR" | "JPY" | "GBP" | "USD";
    position: "prefix" | "sufix";
    symbol: "€" | "¥" | "£" | "$";
    rate: number;
    precision: 0 | 1 | 2;
}

// =============================================================================
// ============================== REDUX THUNKS =================================
// =============================================================================

export const fetchCurrencies = createAsyncThunk(
    'currencies/fetchAll',
    async (_, thunkAPI) => {
        try {
            const resp = await axios.get("https://api.exchangeratesapi.io/latest?base=USD&symbols=EUR,GBP,JPY");
            const rates = Object.entries(resp.data.rates);
            const currencies = rates.map((entry, index) => Object.assign({ id: index + 1 }, mapUnitSymbols[entry[0]], { rate: entry[1] }));
            currencies.push(Object.assign({ id: currencies.length + 1 }, mapUnitSymbols[resp.data.base], { rate: 1 }));
            return currencies;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message })
        }
    }
);

// =============================================================================
// ============================== REDUCERS =====================================
// =============================================================================

export const currenciesAdapter = createEntityAdapter<Currency>();
const initialState = currenciesAdapter.getInitialState({
    selected: null,
});
export const slice = createSlice({
    name: 'currencies',
    initialState,
    reducers: {
        removeCurrency: currenciesAdapter.removeOne,
        selectedCurrencyChanged: (state, action: PayloadAction<Currency>) => {
            state.selected = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchCurrencies.fulfilled, currenciesAdapter.upsertMany);
    }
});


// =============================================================================
// ============================== EXPORTS ======================================
// =============================================================================

const reducer = slice.reducer;
export default reducer;

export const {
    removeCurrency,
    selectedCurrencyChanged,
} = slice.actions;

export const {
    selectById: selectCurrencyById,
    selectIds: selectCurrencyIds,
    selectEntities: selectCurrencyEntities,
    selectAll: selectAllCurrencies,
    selectTotal: selectTotalCurrencies
} = currenciesAdapter.getSelectors<RootState>((state) => state.currencies);