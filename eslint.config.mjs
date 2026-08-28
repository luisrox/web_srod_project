import next from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...next,
  ...nextTypescript,
  {
    ignores: ["playwright-report/**", "test-results/**"],
  },
];

export default config;
