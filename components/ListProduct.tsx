import { Col, Image, List, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Link from "next/link";
import React, { ReactElement } from "react";
import { Item } from "../store/slices/cartSlices";
import { Currency } from "../store/slices/currenciesSlices";
import { Product } from "../store/slices/productsSlices";

export type PropTypes = {
  items: Item[];
  currency?: Currency;
  path?: string;
};

/**
 * Checks if the given object is an instance of Item;
 *
 * @param obj The object to be checked.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const instanceOfItem = (obj: any): obj is Item =>
  "product" in obj && "quantity" in obj;

const sumPrice = (acc: number, item: Item) => acc + item.product.price;

/**
 * Displays a list of items. If a currency is provided prices and total will be
 * converted accordingly to ist rate. If a `path` is provided, the title of
 * the item in the list will be a link to that path.
 *
 * Path
 */
const ListProduct = ({
  items = [],
  currency,
  path,
}: PropTypes): ReactElement => {
  const listStyle = { maxWidth: "992px", margin: "auto", padding: "16px" };

  // Keeps items with good shape
  const filteredItems = items.filter(instanceOfItem);

  // Total price of all products
  const total = Product.formatPrice(
    filteredItems.reduce(sumPrice, 0),
    currency
  );

  return (
    <List
      id="cart-item-list"
      itemLayout="horizontal"
      style={listStyle}
      dataSource={filteredItems}
      renderItem={({ product }) => (
        <ListItem product={product} currency={currency} path={path} />
      )}
      footer={
        <Row style={{ fontSize: "1.2rem" }}>
          <Col>Total</Col>
          <Col flex="auto"></Col>
          <Col flex="none">{total}</Col>
        </Row>
      }
    />
  );
};

export default ListProduct;

/**
 * Creates a component to display product information inside a list. It displays
 * the image of the product, the title (clickable to go to the detail page) and
 * the price in the given currency.
 */
const ListItem = ({ product, currency, path }) => {
  return (
    <List.Item style={{ padding: "16px" }}>
      <Image
        style={{
          maxHeight: "70px",
          maxWidth: "70px",
          padding: "0 16px 0 0",
        }}
        src={product.image}
        preview={false}
      />
      <List.Item.Meta
        style={{ padding: "0 10px" }}
        title={
          !path ? (
            product.title
          ) : (
            <Link href={path.replace("[id]", product.id)}>
              <a>{product.title}</a>
            </Link>
          )
        }
        description={
          <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
        }
      />
      <Row>
        <Col style={{ padding: "0 10px" }}>
          {Product.formatPrice(product.price, currency)}
        </Col>
      </Row>
    </List.Item>
  );
};
