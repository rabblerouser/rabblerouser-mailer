const AWS = require('aws-sdk');
const config = require('./config');

module.exports = new AWS.S3({
  endpoint: config.s3EmailBucketEndpoint,
  region: config.s3Region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
