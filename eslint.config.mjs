import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([
  ...nextVitals, ...nextTs,
  // Database functions are copied from the original audit, including unused
  // Promise rejection parameters in its fallback-only read operations.
  { files:["src/lib/audit/database.js"], rules:{ "@typescript-eslint/no-unused-vars":["warn", { "args":"none" }] } },
  globalIgnores([".next/**", "node_modules/**", "reference/**", "artifacts/**", "next-env.d.ts"]),
]);
