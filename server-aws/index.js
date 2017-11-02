require('../environment.js');
const AWS = require('aws-sdk');
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
  return getQs.then(response => response)
    .catch(err => console.error('error getting queues from AWS SQS', err));
}
 
module.exports = {
  sqs,
  checkConnectionByFetchingQueues
};
