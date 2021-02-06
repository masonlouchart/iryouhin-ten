import { NextPage } from "next";
import React from "react";
import { useSelector } from "react-redux";
import ListProduct from "../components/ListProduct";
import Page from "../components/Page";
import { RootState } from "../store/store";

/**
 * This page displays the content of the user cart. Users can see the total price
 * of the items they have in their cart at the bottom of the list. All prices
 * are displayed in the selected currency.
 */
const CartPage: NextPage = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const currency = useSelector((state: RootState) => state.currencies.selected);
  return (
    <Page>
      <ListProduct items={cart} currency={currency} path="/products/[id]" />
    </Page>
  );
};

export default CartPage;
