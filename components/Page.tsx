import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Badge, Breadcrumb, Button, Col, Layout, Row } from "antd";
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

type Route = {
  path: string;
  breadcrumbName: string;
};

type PageProps = {
  bodyStyle?: Record<string, unknown>;
  route?: Route;
};

/**
 * This page put the children you give in its content section. The header with
 * the menu and footer with buttons for mobiles devices are already included.
 */
const Page: NextPage<PageProps> = ({ children, bodyStyle = {}, route }) => {
  const cart = useSelector((state: RootState) => state.cart);

  return (
    <Layout style={{ backgroundColor: "white" }}>
      <Head>
        <title>IRH-10</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeader badges={{ cart: cart.length }} route={route} />
      <PageContent style={bodyStyle}>{children}</PageContent>
      <FooterMenu badges={{ cart: cart.length }} />
    </Layout>
  );
};
export default Page;

/**
 * The page header display the application title, currency switcher and the menu
 * to navigate through the appication. The menu inside the header is hidden on
 * mobile devices. The buttons are displayed inside the footer.
 */
const PageHeader = ({ badges, route }) => {
  const dispatch = useDispatch();
  const currencies = useSelector(selectAllCurrencies);
  const selectedCurrency = useSelector(
    (state: RootState) => state.currencies.selected
  );

  return (
    <Header
      style={{
        backgroundColor: "white",
        zIndex: 1,
        width: "100%",
        padding: "0 16px",
        height: "unset",
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
            <IconLink
              text="Shop"
              icon={<ShoppingOutlined style={{ fontSize: 24 }} />}
            />
            <Badge
              style={{ backgroundColor: "#1890ff" }}
              count={badges.cart}
              offset={[-10, 10]}
              size="small"
            >
              <IconLink
                href="/cart"
                text="My Cart"
                icon={<ShoppingCartOutlined style={{ fontSize: 24 }} />}
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
      {route ? (
        <Row>
          <Col>
            <PageBreadcrumb route={route} />
          </Col>
        </Row>
      ) : (
        ""
      )}
    </Header>
  );
};

const PageBreadcrumb = ({ route }): React.ReactElement => {
  let routes: Route[];
  if (route) {
    routes = [{ path: "/", breadcrumbName: "Shop" }, route];
  }
  function itemRender(route: Route, _, routes: Route[]) {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <Link href={route.path}>
        <a>{route.breadcrumbName}</a>
      </Link>
    );
  }
  return <Breadcrumb itemRender={itemRender} routes={routes} />;
};

/**
 * Container for the main part of the application. Its is the entire space between
 * the header and the dynamically displayed bottom menu.
 */
const PageContent = ({ children, style }) => {
  const contentStyle = Object.assign(
    {
      overflowX: "hidden",
    },
    style
  ) as BasicProps;
  return <Content style={contentStyle}>{children}</Content>;
};

/**
 * This page footer is visible only on mobile devices. It displays buttons to
 * navigate through the application.
 */
const FooterMenu = ({ badges }) => {
  return (
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
  );
};

/**
 * Makes an icon clickable and redirecting to the given URI (without reloading
 * the entire page).
 */
const IconLink = ({ icon, href = "/", text = "" }) => {
  return (
    <Link href={href}>
      <a>
        <Button
          style={{ fontSize: "1.2rem" }}
          size="large"
          type="text"
          icon={icon}
        >
          {text}
        </Button>
      </a>
    </Link>
  );
};
