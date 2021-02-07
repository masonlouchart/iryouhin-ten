import { Button, Col, Image, Row, Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import Page from "../../components/Page";
import { addToCart, removeFromCart } from "../../store/slices/cartSlices";
import { fetchCurrencies } from "../../store/slices/currenciesSlices";
import {
  fetchProductById,
  Product,
  selectProductById,
} from "../../store/slices/productsSlices";
import { AppThunkDispatch, RootState, wrapper } from "../../store/store";

const { Title, Text } = Typography;

/**
 * The product page display the item image in big size. It is possible to display
 * it in fulscreen by clicking on the picture. The half bottom of the page
 * show the price, title and description of the product. It alos contains buttons
 * to do some actions (add/remove to cart, etc...).
 */
const ProductPage: NextPage = () => {
  // Fallback when the product page has not been pre-rendered.
  const router = useRouter();
  if (router.isFallback) {
    return <Loading />;
  }
  // Get product to display the details.
  const productId = Number(router.query.id);
  const state = useSelector((state: RootState) => state);
  const product = selectProductById(state, productId);
  if (!product) {
    return <Loading />;
  }
  // Get currency selected by the user.
  const currency = state.currencies.selected;

  // Define the current breadcrumb.
  const route = {
    path: `/products/${productId}`,
    breadcrumbName: `Products / ${product.title}`,
  };

  return (
    <Page bodyStyle={{ padding: 0 }} route={route}>
      <Row style={{ height: "100%" }} align="bottom">
        <Col span={24}>
          <ProductImage product={product} />
        </Col>
        <Col span={24}>
          <ProductDetail product={product} currency={currency} />
        </Col>
      </Row>
    </Page>
  );
};

export default ProductPage;

/**
 * Uses the given product to create an image display in the center of the screen.
 * Clicking on the image display it fullscreen.
 */
const ProductImage = ({ product }) => {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <Image
        style={{
          width: "auto",
          maxWidth: "180px",
          maxHeight: "30vh",
          margin: "auto",
        }}
        alt={product.title}
        src={product.image}
      />
    </div>
  );
};

/**
 * Creates a section to display product details and any action buttons to add
 * to a cart, remove it from a cart, and so on.
 */
const ProductDetail = ({ product, currency }) => {
  return (
    <div
      className="product-detail"
      style={{
        borderRadius: "30px 30px 0 0",
        boxShadow: "0px -5px 5px lightgray",
        padding: "16px 20px 32px 20px",
        margin: "auto",
        minHeight: "30vh",
      }}
    >
      <style jsx>{`
        @media (min-width: 480px) {
          .product-detail {
            max-width: 60vw;
          }
        }
      `}</style>
      <Col style={{ paddingBottom: "16px" }} span={24}>
        <Row>
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              {Product.formatPrice(product.price, currency)}
            </Title>
          </Col>
          <Col flex="auto" />
          <Col>
            <CartButton product={product}></CartButton>
          </Col>
        </Row>
      </Col>
      <Col style={{ paddingBottom: "16px" }} flex="none">
        <Text type="secondary">{product.title}</Text>
      </Col>
      <Col span={24}>
        <Paragraph style={{ marginBottom: 0 }}>{product.description}</Paragraph>
      </Col>
    </div>
  );
};

/**
 * Creates a button to add and remove the given product into/from the user cart.
 */
const CartButton = ({ product }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart);
  const itemInCart = cart.find((item) => item.product.id === product.id);

  return !itemInCart ? (
    <Button
      type="primary"
      shape="round"
      onClick={() => dispatch(addToCart(product))}
    >
      Add To Cart
    </Button>
  ) : (
    <Button
      type="primary"
      shape="round"
      onClick={() => dispatch(removeFromCart(product))}
      danger
    >
      Remove From Cart
    </Button>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Pre-render the 10 first product pages.
    paths: Array.from(Array(10), (_, i) => {
      return { params: { id: `${++i}` } };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  async ({ store, params }) => {
    // Load products and currencies to pre-render product pages and currency
    // switcher inside the header.
    const dispatch: AppThunkDispatch = store.dispatch;
    await dispatch(fetchProductById({ id: Number(params.id) }));
    await dispatch(fetchCurrencies());
  }
);
