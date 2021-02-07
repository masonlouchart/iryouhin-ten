import { Col, Row } from "antd";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import CardProduct from "../components/CardProduct";
import Page from "../components/Page";
import { fetchCurrencies } from "../store/slices/currenciesSlices";
import {
  fetchProducts,
  selectAllProducts,
} from "../store/slices/productsSlices";
import { AppThunkDispatch, RootState, wrapper } from "../store/store";

/**
 * Home page of the application. It displays products in the middle of the page.
 */
const HomePage: NextPage = () => {
  const products = useSelector(selectAllProducts);
  const selectedCurrency = useSelector(
    (state: RootState) => state.currencies.selected
  );

  return (
    <Page>
      <Row
        style={{ padding: "16px 0px" }}
        gutter={[16, { xs: 16, sm: 16, md: 24, lg: 32 }]}
        justify="center"
      >
        {products.map((product, index) => (
          <Col key={index} className="gutter-row">
            <Link href={`/products/${product.id}`}>
              <a>
                <CardProduct
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  currency={selectedCurrency}
                />
              </a>
            </Link>
          </Col>
        ))}
      </Row>
    </Page>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  async ({ store }) => {
    const dispatch: AppThunkDispatch = store.dispatch;
    await dispatch(fetchProducts({ count: 10 }));
    await dispatch(fetchCurrencies());
  }
);
