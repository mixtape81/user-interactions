const { sqs } = require('./');

const queueUrl = process.env.AWS_URL;

// add permissions for queue on AWS SQS
const addPermissionsForQueue = (params) => {
  const addPermissions = sqs.addPermissionAsync(params).promise();
  return addPermissions.then(data => console.log('data received after adding permissions', data))
    .catch(err => console.error('error adding permissions AWS SQS queue', err));
};

// create a queue if needed on AWS SQS
const createQueue = (params) => {
  const createQ = sqs.createQueue(params).promise();
  return createQ.then(data => console.log('created AWS SQS queue', data))
    .catch(err => console.error('error creating AWS SQS queue', err));
};

// get messages from a queue
const getMessages = (params) => {
  const receiveMessage = sqs.receiveMessage(params).promise();
  return receiveMessage.then(data => data)
    .catch(err => console.error('error receiving messages from queue', err));
};

// send messages to a queue
const sendMessage = (message) => {
  const sendData = sqs.sendMessage(message).promise();
  return sendData.then(data => data)
    // .catch(err => console.error('error sending messages to queue', err));
};

// get messages from a queue
const deleteMessage = (params) => {
  const deleteMsg = sqs.deleteMessage(params).promise();
  return deleteMsg.then(data => data)
    .catch(err => console.error('error deleting message from queue', err));
};

module.exports = {
  addPermissionsForQueue,
  createQueue,
  getMessages,
  sendMessage,
  deleteMessage
};

