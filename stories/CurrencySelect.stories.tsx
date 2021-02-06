import React from "react";
import CurrencySwitcher, { CurrencySwitcherProps } from "../components/CurrencySwitcher";

export default {
  component: CurrencySwitcher,
  title: "CurrencySelect",
};

const Template = (args: CurrencySwitcherProps) => <CurrencySwitcher {...args} />;

const currencies = [
  { unit: "EUR", position: "suffix", symbol: "€", rate: 0.82 },
  { unit: "GBP", position: "prefix", symbol: "£", rate: 0.73 },
  { unit: "JPY", position: "prefix", symbol: "¥", rate: 104.69 },
  { unit: "USD", position: "prefix", symbol: "$", rate: 1 },
];

export const Default = Template.bind({});

export const WithCurrencies = Template.bind({});
WithCurrencies.args = {
  currencies,
};
