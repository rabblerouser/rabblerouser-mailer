const aws = require('aws-sdk');
const config = require('./config');

module.exports = new aws.SES({
  region: config.sesRegion,
  endpoint: config.sesEndpoint,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
