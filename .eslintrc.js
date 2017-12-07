module.exports = {
  root: true,
  env: {
    browser: true,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'config/webpack.config.dev.js',
      },
    },
  },
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: [
    'react',
    'jsx-a11y',
    'import',
  ],
  rules: {
    strict: 2,
    'no-param-reassign': [2, { "props": false }],
    'import/prefer-default-export': 0,
  },
  globals: {
    trackJs: true,
    ga: true,
  },
};
