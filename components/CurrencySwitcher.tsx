import { Select } from "antd";
import React, { ReactElement, useEffect } from "react";
import { Currency } from "../store/slices/currenciesSlices";

export type CurrencySwitcherProps = {
  currencies?: Currency[];
  defaultCurrency?: string;
  onSelect?: (value: Currency) => void;
};

type CurrencySwitcherOption = {
  key: string;
  value: string;
  label: string;
};

/**
 * A select input for currencies.
 */
const CurrencySwitcher = ({
  currencies,
  defaultCurrency = "USD",
  onSelect,
}: CurrencySwitcherProps): ReactElement => {
  const values = sanitizeCurrencies(currencies);
  const options = currenciesToOptions(values);
  const defaultValue = _computeDefaultValue(values, defaultCurrency);

  useEffect(() => {
    // Call the provided "onSelect" callback when the compoenent is mounted to
    // make sure the default selected currency is known from outside.
    onSelect(values.find((c) => c.unit === defaultValue));
  }, []);

  return (
    <Select
      bordered={false}
      options={options}
      size="large"
      defaultValue={defaultValue}
      onChange={createCallback(values, onSelect)}
    />
  );
};
export default CurrencySwitcher;

/**
 * Checks of the given currency is in options list.
 *
 * @param currencies The currencies available in the select
 * @param currency The currency to check is present in options list
 */
const _computeDefaultValue = (currencies: Currency[], currency: string) => {
  const c = currencies.find((c) => c.unit === currency);
  return c?.unit || currencies.find((c) => c.rate === 1)?.unit || "USD";
};

/**
 * Makes sure the received argument is an array of currencies and sorts them by
 * unit.
 *
 * @param currencies The currencies list to be sanitized.
 */
function sanitizeCurrencies(currencies: Currency[]) {
  const values = currencies instanceof Array ? currencies : [];
  values.sort((a, b) => a.unit.localeCompare(b.unit));
  // Make sure there is always one value
  if (values.length === 0) {
    values.push({
      unit: "USD",
      position: "prefix",
      symbol: "$",
      precision: 2,
      rate: 1,
    } as Currency);
  }
  return values;
}

/**
 * Converts a list of currencies into list of options.
 *
 * @param currencies The currencies list to be converted.
 */
const currenciesToOptions = (
  currencies: Currency[]
): CurrencySwitcherOption[] =>
  currencies.map((currency) => {
    return {
      key: `currency-opt-${currency.unit}`,
      value: currency.unit,
      label: `${currency.unit} (${currency.symbol})`,
    };
  });

/**
 * Creates a function which provides calls a provided callback when the selected
 * value changes. The new valaue is passed as argument of the provided callback.
 *
 * @param currencies Currencies displayed by the component
 * @param f The callback to be called on selected value changed
 */
function createCallback(currencies: Currency[], f: unknown) {
  return (value: string) => {
    if (typeof f === "function") {
      f(currencies.find((currency) => currency.unit === value));
    }
  };
}
