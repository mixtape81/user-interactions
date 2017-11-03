require('../environment.js');
const AWS = require('aws-sdk');
// const Consumer   require('./aws-queries.js');
AWS.config.setPromisesDependency(require('bluebird'));

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
};

const sqs = new AWS.SQS(config);

// If list is received, connection was successful and established
const checkConnectionByFetchingQueues = (params) => {
  const getQs = sqs.listQueues(params).promise();
  return getQs.then(response => console.log(response))
    .catch(err => console.error('error getting queues from AWS SQS', err));
};
checkConnectionByFetchingQueues({});

// const app = Consumer.create({
//   queueUrl: process.env.AWS_URL,
//   waitTimeSeconds: 15,

//   handleMessage: queries.processMessages
//   // add message to database based on attributes
//   // or send to elastic search
// });

// app.on('error', (err) => {
//   console.error(err.message);
// });

// app.start();

module.exports = {
  sqs,
  checkConnectionByFetchingQueues
};
