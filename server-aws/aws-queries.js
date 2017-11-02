const sqs = require('./');

const queueUrl = process.env.AWS_URL;

// add permissions for queue on AWS SQS
const addPermissionsForQueue = (params) => {
  const addPermissions = sqs.addPermissionAsync(params).promise();
  addPermissions.then(data => console.log('data received after adding permissions', data))
    .catch(err => console.error('error adding permissions AWS SQS queue', err));
};

// create a queue if needed on AWS SQS
const createQueue = (params) => {
  const createQ = sqs.createQueue(params).promise();
  createQ.then(data => console.log('created AWS SQS queue', data))
    .catch(err => console.error('error creating AWS SQS queue', err));
};

// get messages from a queue
const getMessages = (params) => {
  const receiveMessage = sqs.receiveMessage(params).promise();
  receiveMessage.then(data => console.log('received messages from queue', data))
    .catch(err => console.error('error receiving messages from queue', err));
};

// send messages to a queue
const sendMessage = (message, url = queueUrl) => {
  const params = {
    MessageBody: message,
    QueueUrl: url
  };
  const sendData = sqs.sendMessage(params).promise();
  sendData
    .then(data => console.log('sent message to queue', data))
    .catch(err => console.error('error sending messages to queue', err));
};

module.exports = {
  addPermissionsForQueue,
  createQueue,
  getMessages,
  sendMessage
};

