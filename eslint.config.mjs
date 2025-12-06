/** @author Ka Pui (August) Cheung */

import path from "node:path";
import { fileURLToPath } from "node:url";

import docusaurusPlugin from "@docusaurus/eslint-plugin";
import { includeIgnoreFile } from "@eslint/compat";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/** @see https://eslint.org/docs/latest/use/configure/ */
const eslintConfig = tseslint.config(
  includeIgnoreFile(gitignorePath),

  // eslint-disable-next-line import/no-named-as-default-member
  tseslint.configs.recommendedTypeChecked,
  // eslint-disable-next-line import/no-named-as-default-member
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.config.js"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  eslintPluginUnicorn.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },

  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  jsxA11y.flatConfigs.recommended,

  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "import/consistent-type-specifier-style": ["warn", "prefer-inline"],
      "import/newline-after-import": "warn",
      "import/no-duplicates": [
        "error",
        {
          "prefer-inline": true,
        },
      ],
      "react/jsx-curly-brace-presence": ["warn", "never"],
      "react/jsx-sort-props": [
        "warn",
        {
          callbacksLast: true,
          multiline: "last",
          reservedFirst: true,
          shorthandFirst: true,
        },
      ],
      "unicorn/filename-case": [
        "warn",
        {
          cases: {
            kebabCase: true,
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": [
        "warn",
        {
          replacements: {
            args: false,
            dev: false,
            env: false,
            params: false,
            props: false,
            ref: false,
          },
        },
      ],
    },
  },

  {
    plugins: {
      "@docusaurus": docusaurusPlugin,
    },
    rules: {
      "import/no-unresolved": [
        "error",
        { ignore: ["^@theme", "^@docusaurus", "^@site"] },
      ],
      "@docusaurus/string-literal-i18n-messages": "error",
      "@docusaurus/no-html-links": "warn",
      "@docusaurus/prefer-docusaurus-heading": "warn",
    },
  },

  eslintConfigPrettier,
);

export default eslintConfig;
