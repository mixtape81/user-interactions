const dummydata = require('./dummyData.js');

dummydata.addToViewTest()
  .then(result => {
    console.log('result in data-tests', result);
  })
  .catch(err => console.log('err adding data', err));

  dummydata.addToViewTest()
  .then(result => {
    console.log('result in data-tests', result);
  })
  .catch(err => console.log('err adding data', err));

  dummydata.addToViewTest()
  .then(result => {
    console.log('result in data-tests', result);
  })
  .catch(err => console.log('err adding data', err));

// for (let i = 0; i < 100; i++) {
//   dummydata.addToViewTest()
//     .then(result => {
//       console.log('result in data-tests', result);
//     })
//     .catch(err => console.log('err adding data', err));
// }