const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
const config = require('./config');

const ses = new aws.SES({
  region: config.sesRegion,
  endpoint: config.sesEndpoint,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});

module.exports = nodemailer.createTransport({ SES: ses });
