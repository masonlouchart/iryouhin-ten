import { Action, AnyAction, configureStore, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE, MakeStore } from "next-redux-wrapper";
import { combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import cart from "./slices/cartSlices";
import currencies from "./slices/currenciesSlices";
import products from "./slices/productsSlices";

const combinedReducer = combineReducers({
  products,
  currencies,
  cart,
});

export type RootState = ReturnType<typeof combinedReducer>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // Use previous state
      ...action.payload, // Apply delta from hydration
    };
    if (state.currencies.selected) {
      // Preserve selected currency value on client side navigation
      nextState.currencies.selected = state.currencies.selected;
    }
    if (state.cart.length) {
      // Preserve cart content on client side navigation
      nextState.cart = state.cart;
    }
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
}

const makeStore: MakeStore<RootState> = () => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      if (process.env.NODE_ENV === "production") {
        return getDefaultMiddleware();
      }
      return getDefaultMiddleware().concat(loggerMiddleware);
    }
  });
  return store;
};

export const wrapper = createWrapper(makeStore, {
  storeKey: "iryouhin-ten",
});
