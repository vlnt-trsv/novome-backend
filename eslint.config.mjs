// @ts-check
import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    // Игнорируем технические файлы и папки
    ignores: ["eslint.config.mjs", "node_modules", "dist", "prisma/generated"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      // Для NestJS лучше оставить module, так как мы используем import/export
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",

      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",

      // Важно для асинхронных операций NestJS
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],

      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
)
