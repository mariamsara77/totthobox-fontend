import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Custom Rules
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }], // console.log দিলে ওয়ার্নিং দেবে
      "@typescript-eslint/no-unused-vars": "warn", // অব্যবহৃত ভ্যারিয়েবলে ওয়ার্নিং
    },
  },

  // Files/Directories to Ignore
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;