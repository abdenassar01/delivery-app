import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "eslint";

import expoConfig from "eslint-config-expo/flat.js";
import i18nJsonPlugin from "eslint-plugin-i18n-json";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactCompiler from "eslint-plugin-react-compiler";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tailwind from "eslint-plugin-tailwindcss";
import testingLibrary from "eslint-plugin-testing-library";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";

import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  {
    ignores: [
      "dist/*",
      "node_modules/",
      "__tests__/",
      "coverage/",
      ".expo/",
      ".expo-shared/",
      "android/",
      "ios/",
      ".vscode/",
      "docs/",
      "cli/",
      "expo-env.d.ts",
    ],
  },

  // Your existing configurations (these are good!)
  expoConfig,
  eslintPluginPrettierRecommended,
  ...tailwind.configs["flat/recommended"],
  reactCompiler.configs.recommended,

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      unicorn: eslintPluginUnicorn,
      "unused-imports": unusedImports,
    },
    rules: {
      "max-params": ["error", 3],
      "max-lines-per-function": ["error", 70],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
    },
  },

  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/comma-dangle": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
          disallowTypeAnnotations: true,
        },
      ],
    },
  },

  {
    files: ["src/translations/*.json"],
    plugins: { "i18n-json": i18nJsonPlugin },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: { "testing-library": testingLibrary },
    rules: {
      ...testingLibrary.configs.react.rules,
    },
  },
]);
