module.exports = {
  extends: ['airbnb-typescript-prettier', 'plugin:jsx-a11y/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.js'],
      parser: 'babel-eslint',
      rules: {},
    },
  ],
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  rules: {
    'react/no-array-index-key': 0,
    'react/prop-types': 0,
    'react/require-default-props': 0,
    'react/destructuring-assignment': 0,
    'react/static-property-placement': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: ['arrow-function', 'function-declaration'],
        unnamedComponents: 'arrow-function',
      },
    ],
    'jsx-a11y/alt-text': 0,
    'react/jsx-props-no-spreading': 0,
    '@typescript-eslint/camelcase': ['off'], // There seems to be no other way to override this than disabling it and rewriting the rules in the naming-convention
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        // leadingUnderscore: 'allow',
        // trailingUnderscore: 'allow',
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase'],
      },
      {
        selector: 'property',
        format: ['camelCase', 'snake_case', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'enumMember',
        format: ['camelCase', 'snake_case', 'UPPER_CASE'],
      },
    ],
    '@typescript-eslint/ban-ts-comment': 1,
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
    // Explore these
    '@typescript-eslint/ban-types': 1,
    'react/jsx-no-constructed-context-values': 1,
    'react-hooks/exhaustive-deps': 1,
    'react/no-unstable-nested-components': 1,
    'react/jsx-no-useless-fragment': 1,
    'react/no-unused-prop-types': 1,
  },
  globals: {
    cy: true,
  },
  plugins: ['jsx-a11y'],
};
