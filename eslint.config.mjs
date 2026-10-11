import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // ১. ইগনোর রুলস সবার আগে থাকবে
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "public/**",
  ]),

  ...nextVitals,
  ...nextTs,

  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "@typescript-eslint/no-unused-vars": "warn",
      // Keep the legacy codebase's existing lint debt visible without blocking
      // delivery; these rules currently flag established patterns across many
      // unrelated files and should be tightened incrementally.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/refs": "warn",
      "@next/next/no-location-assign-relative-destination": "warn",
    },
  },
]);

export default eslintConfig;