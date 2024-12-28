import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      // Possible errors
      "no-console": "warn",
      "no-debugger": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",

      // Best Practices
      eqeqeq: "error",
      // curly: "warn",
      "no-eval": "error",
      "no-implicit-coercion": "warn",

      // Variables
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-shadow": "error",
      "no-redeclare": "error",

      // Code Complexity
      // "max-depth": ["warn", 4],
      "max-lines": ["warn", 300],
      // complexity: ["warn", 10],
      "max-nested-callbacks": ["warn", 3],

      // ES6
      "no-var": "error",
      "prefer-const": "error",
      "no-duplicate-imports": "error",
    },
  },
];
