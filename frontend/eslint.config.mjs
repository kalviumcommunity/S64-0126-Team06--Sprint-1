import next from "eslint-config-next";

export default [
  ...next,
  {
    rules: {
      "no-console": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  }
];
