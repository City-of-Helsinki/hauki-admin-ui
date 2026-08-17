import js from '@eslint/js';
import tsEslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import eslintReact from '@eslint-react/eslint-plugin';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import vitestGlobals from 'eslint-config-vitest-globals/flat';
import importPlugin from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/build/**',
      '**/coverage/**',
      '**/dist/**',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
      tsEslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
      importPlugin.flatConfigs.recommended,
      jsxA11yPlugin.flatConfigs.recommended,
      reactHooksPlugin.configs.flat['recommended-latest'],
      vitestGlobals(),
      // Must stay last so it disables stylistic rules that conflict with Prettier.
      eslintConfigPrettier,
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        cy: true,
      },
    },
    settings: {
      'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import-x/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          paths: ['src'],
        },
      },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'variable', format: ['camelCase', 'PascalCase'] },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        { selector: 'property', format: null },
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'enumMember',
          format: ['camelCase', 'snake_case', 'UPPER_CASE'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/ban-ts-comment': 1,
      '@eslint-react/use-state': 0,
      '@eslint-react/no-context-provider': 0,
      '@eslint-react/no-use-context': 0,
      '@eslint-react/set-state-in-effect': 0,
      '@eslint-react/purity': 0,
      '@eslint-react/exhaustive-deps': 0,
      '@eslint-react/naming-convention-ref-name': 0,
      '@eslint-react/no-array-index-key': 0,
      '@eslint-react/web-api-no-leaked-event-listener': 0,
      'react-hooks/set-state-in-effect': 0,
      'jsx-a11y/alt-text': 0,
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelComponents: [],
          labelAttributes: [],
          controlComponents: [],
          assert: 'htmlFor',
          depth: 25,
        },
      ],
      camelcase: 0,
      'no-console': 0,
      'func-names': 0,
      'import-x/no-anonymous-default-export': 0,
      'import-x/named': 0,
      'import-x/namespace': 0,
      'import-x/no-named-as-default-member': 0,
      'import-x/no-unresolved': [
        'error',
        { ignore: ['../public/test-env-config.js'] },
      ],
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/setupTests.ts',
      '**/testSetup.ts',
    ],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
    },
  },
]);
