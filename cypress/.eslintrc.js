module.exports = {
  extends: './../.eslintrc.js',
  env: {
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  rules: {
    '@typescript-eslint/triple-slash-reference': ['off']
  }
};
