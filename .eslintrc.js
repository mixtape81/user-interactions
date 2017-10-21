module.exports = {
  extends: './node_modules/eslint-config-airbnb-base/index.js',
  rules: {
    'comma-dangle': ["error", "never"]
  }
};

// module.exports = {
//   "extends": "airbnb",
//   "parser": "babel-eslint",
//   "env": {
//     "browser": true,
//     "node": true,
//     "es6": true,
//     "mocha": true
//   },
//   "rules": {
//     "import/no-extraneous-dependencies": ["error", {
//       "devDependencies": [
//         "spec/**",
//       ]
//     }],
//     "comma-dangle": ["error", "never"]
//   }
// };