const logger = require('./logger');
const ses = require('./ses');
const streamClient = require('./streamClient');

const data = string => ({ Data: string });

const publishEmailEvent = (eventType, emailId, recipients) => () => {
  if (!recipients.length) { return Promise.resolve(); }

  return streamClient.publish(eventType, { emailId, to: recipients })
    .catch(() => {
      logger.error(`Failed to publish ${eventType} event: { emailId: ${emailId}, to: ${recipients} }`);
    });
};


const assembleEmail = (email) => {
  const { from, subject, body } = email;

  const commonSesParams = {
    Source: from,
    ReplyToAddresses: [from],
    Message: {
      Subject: data(subject),
      Body: {
        Html: data(body),
      },
    },

  };

  return Promise.resolve(commonSesParams);
};

const sendEmail = (email) => {
  const { to, id } = email;

  const sentRecipients = [];
  const failedRecipients = [];

  return assembleEmail(email)
  .then(commonSesParams => {

    return Promise.all(to.map((recipient) => {

      const sesParams = Object.assign({}, commonSesParams, {
        Destination: { ToAddresses: [recipient] },
      });
      return ses.sendEmail(sesParams).promise().then(
        () => sentRecipients.push(recipient) && logger.info(`Sent email ${id} to ${recipient}`),
        () => failedRecipients.push(recipient) && logger.error(`Failed to send email ${id} to ${recipient}`)
      );
    }))
  })
  .then(publishEmailEvent('email-sent', id, sentRecipients))
  .then(publishEmailEvent('email-failed', id, failedRecipients));
};

module.exports = sendEmail;
