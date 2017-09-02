const s3 = require('./s3');
const config = require('./config');
const mailParser = require('mailparser').simpleParser;

const build = (emailBodyLocation) => {
  const bucket = config.s3EmailBucket;
  return s3.getObject({ Key: emailBodyLocation, Bucket: bucket })
    .promise()
    .then(mailParser)
    .then(mail => mail.html)
    .catch(() => {
      throw 'Email not found';
    });
};

module.exports = build;
