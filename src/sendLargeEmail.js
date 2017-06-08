const logger = require('./logger');
const s3 = require('./s3');
const sendEmail = require('./sendEmail');
const streamClient = require('./streamClient');

function publishToStream(event) {
  const { type, message } = event;
  return streamClient.publish(type, message)
    .catch(() => {
      logger.error(`Failed to publish ${type} event: ${JSON.stringify(message)}`);
    });
}

const parseMimeFile = () => ({
  to: 'pamela.rucinque@gmail.com',
  from: 'pamela.rucinque@thoughtworks.com',
  subject: 'Check this out',
  body: 'Some important text',
  attachments: [],
});

function downloadMimeFile(mimeFileLocation) {
  return s3.getObject(mimeFileLocation)
  .catch(publishToStream());
}

function setEmailId(id) {
  return (email) => {
    const emailWithId = email;
    emailWithId.id = id;
    return emailWithId;
  };
}

const sendLargeEmail = (largeEmail) => {
  const { id, mimeFileLocation } = largeEmail;

  return downloadMimeFile(mimeFileLocation)
  .then(parseMimeFile)
  .then(setEmailId(id))
  .then(sendEmail);
};

module.exports = sendLargeEmail;
