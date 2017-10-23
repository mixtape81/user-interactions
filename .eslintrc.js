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
    // "import/no-extraneous-dependencies": ["error", { "devDependencies": ["tests/**"] }]
  }
};



// "import/no-extraneous-dependencies": ["error", {
//       "devDependencies": [
//         "tests/**",
//       ]
//     }],


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