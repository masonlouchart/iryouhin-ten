module.exports = {
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended", // recommended eslint rules for typescript
    // "prettier/@typescript-eslint", // make eslint compatible with prettier formatting
    // "plugin:prettier/recommended", // eslint shows prettier formatting warnings. Must be always the last configuration.
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};
