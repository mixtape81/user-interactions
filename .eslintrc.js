module.exports = {
  "extends": "./node_modules/eslint-config-airbnb-base/index.js",
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true
  },
  "rules": {
    "comma-dangle": ["error", "never"]
  }
}
// "import/no-extraneous-dependencies": ["error", { "devDependencies": ["tests/**"] }]