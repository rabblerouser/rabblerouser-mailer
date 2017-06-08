const AWS = require('aws-sdk');

module.exports = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});
