module.exports = {
  env: {
    jest: true
  },
  plugins: [
    'jest',
    'chai-expect',
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,
    'no-underscore-dangle': 0,
    'no-unused-expressions': 0,
    'no-throw-literal': 0,
  },
  globals: {
    context: true,
    FactoryGirl: true,
    uuid: true,
    Faker: true,
  },
}
