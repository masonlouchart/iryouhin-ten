import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Affix, Badge, Button, Col, Layout, Row } from "antd";
import { BasicProps } from "antd/lib/layout/layout";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllCurrencies,
  selectedCurrencyChanged,
} from "../store/slices/currenciesSlices";
import { RootState } from "../store/store";
import CurrencySwitcher from "./CurrencySwitcher";

const { Header, Content } = Layout;

type PageProps = {
  bodyStyle?: Record<string, unknown>;
};

/**
 * This page put the children you give in its content section. The header with
 * the menu and footer with buttons for mobiles devices are already included.
 */
const Page: NextPage<PageProps> = ({ children, bodyStyle = {} }) => {
  const contentStyle = Object.assign(
    {
      marginTop: "64px",
      padding: "16px 0px",
      overflowX: "hidden",
    },
    bodyStyle
  ) as BasicProps;

  const cart = useSelector((state: RootState) => state.cart);

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Head>
        <title>IRH-10</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeader badges={{ cart: cart.length }} />
      <Content style={contentStyle}>
        {children}
        <PageFooter badges={{ cart: cart.length }} />
      </Content>
    </Layout>
  );
};
export default Page;

/**
 * The page header display the application title, currency switcher and the menu
 * to navigate through the appication. The menu inside the header is hidden on
 * mobile devices. The buttons are displayed inside the footer.
 */
const PageHeader = ({ badges }) => {
  const dispatch = useDispatch();
  const currencies = useSelector(selectAllCurrencies);
  const selectedCurrency = useSelector(
    (state: RootState) => state.currencies.selected
  );

  return (
    <Header
      style={{
        backgroundColor: "white",
        position: "fixed",
        zIndex: 1,
        width: "100%",
        padding: "0 16px",
      }}
    >
      <Row wrap={false}>
        <Col flex="none">
          <Link href="/">
            <a>
              <h1>衣料品 10</h1>
            </a>
          </Link>
        </Col>
        <Col flex="auto" />
        <Col>
          <div className="menu">
            <style jsx>{`
              @media (max-width: 480px) {
                .menu {
                  display: none;
                }
              }
            `}</style>
            <IconLink icon={<ShoppingOutlined style={{ fontSize: 26 }} />} />
            <Badge
              style={{ backgroundColor: "#1890ff" }}
              count={badges.cart}
              offset={[-10, 10]}
              size="small"
            >
              <IconLink
                href="/cart"
                icon={<ShoppingCartOutlined style={{ fontSize: 26 }} />}
              />
            </Badge>
          </div>
        </Col>
        <Col flex="none">
          <CurrencySwitcher
            currencies={currencies}
            defaultCurrency={selectedCurrency?.unit}
            onSelect={(value) => dispatch(selectedCurrencyChanged(value))}
          />
        </Col>
      </Row>
    </Header>
  );
};

/**
 * This page footer is visible only on mobile devices. It displays buttons to
 * navigate through the application.
 */
const PageFooter = ({ badges }) => {
  return (
    <Affix
      key="affix-footer-menu"
      offsetBottom={0}
      style={{ position: "absolute" }}
    >
      <div
        className="footer"
        style={{
          backgroundColor: "white",
          width: "100vw",
          padding: "16px 0",
        }}
      >
        <style jsx>{`
          @media (min-width: 480px) {
            .footer {
              display: none;
            }
          }
        `}</style>
        <Row justify="space-around">
          <Col>
            <IconLink icon={<ShoppingOutlined style={{ fontSize: 32 }} />} />
          </Col>
          <Col>
            <Badge
              style={{ backgroundColor: "#1890ff" }}
              count={badges.cart}
              offset={[-10, 10]}
              size="small"
            >
              <IconLink
                href="/cart"
                icon={<ShoppingCartOutlined style={{ fontSize: 32 }} />}
              />
            </Badge>
          </Col>
        </Row>
      </div>
    </Affix>
  );
};

/**
 * Makes an icon clickable and redirecting to the given URI (without reloading
 * the entire page).
 */
const IconLink = ({ icon, href = "/" }) => {
  return (
    <Link href={href}>
      <a>
        <Button size="large" type="text" icon={icon}></Button>
      </a>
    </Link>
  );
};
