const s3 = require('./s3');
const config = require('./config');
const mailParser = require('mailparser').simpleParser;

const build = (emailBodyLocation) => {
  const bucket = config.s3EmailBucket;
  return s3.getObject({ Key: emailBodyLocation, Bucket: bucket })
    .promise()
    .then(s3Object => mailParser(s3Object.Body))
    .then(mail => mail.html)
    .catch(() => {
      throw new Error(`Email body with ${emailBodyLocation} not found`);
    });
};

module.exports.build = build;
