import {
    createSlice, PayloadAction
} from '@reduxjs/toolkit';
import { Product } from './productsSlices';

// =============================================================================
// ============================== CONSTANTS ====================================
// =============================================================================

export class Item {
    product: Product;
    quantity = 0;
}

const initialState: Item[] = [];

// =============================================================================
// ============================== REDUCERS =====================================
// =============================================================================

export const slice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            return [...state, { product: action.payload, quantity: 1 }];
        },
        removeFromCart: (state, action: PayloadAction<Product>) => {
            return state.filter((i) => i.product.id !== action.payload.id);
        },
        incrementQuantity: (state, action: PayloadAction<Product>) => {
            const item = state.find((i) => i.product.id === action.payload.id);
            if (item) {
                item.quantity++;
            }
            return state;
        },
        decrementQuantity: (state, action: PayloadAction<Product>) => {
            const item = state.find((i) => i.product.id === action.payload.id);
            if (item) {
                item.quantity--;
            }
            return state;
        },
    }
});

// =============================================================================
// ============================== EXPORTS ======================================
// =============================================================================

const reducer = slice.reducer;
export default reducer;

export const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
} = slice.actions;
