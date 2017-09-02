const s3 = require('./s3');
const mailParser = require('mailParser');

const parseMimeFile = (mimeFile) => {
  return {
    to: 'email@gmail.com',
    from: 'email@notyourbusiness.com',
    subject: 'Check this out',
    body: 'Some important text',
    attachments: [],
  };
};

function fetchEmailBodyFromS3(emailBodyLocation) {
  return s3.getObject(emailBodyLocation).promise()
  .then(parseMimeFile);
}

module.export = fetchEmailBodyFromS3;
