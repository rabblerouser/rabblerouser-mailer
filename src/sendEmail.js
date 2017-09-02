const logger = require('./logger');
const ses = require('./ses');
const streamClient = require('./streamClient');
const s3BodyBuilder = require('./s3BodyBuilder.js');

const data = string => ({ Data: string });

const publishEmailEvent = (eventType, emailId, recipients) => () => {
  if (!recipients.length) { return Promise.resolve(); }

  return streamClient.publish(eventType, { emailId, to: recipients })
    .catch(() => {
      logger.error(`Failed to publish ${eventType} event: { emailId: ${emailId}, to: ${recipients} }`);
    });
};

const sesParams = (email) => {
  const { from, subject, body } = email;

  return {
    Source: from,
    ReplyToAddresses: [from],
    Message: {
      Subject: data(subject),
      Body: {
        Html: data(body),
      },
    },
  };
};

const assembleEmail = (email) => {
  const { from, subject, body, bodyLocation } = email;

  if (body) {
    return Promise.resolve(sesParams({ from, subject, body }));
  }

  return s3BodyBuilder.build(bodyLocation).then(largeBody => (
    sesParams({ from, subject, body: largeBody })
  ));
};

const sendEmail = (emailEvent) => {
  const { to, id } = emailEvent;

  const sentRecipients = [];
  const failedRecipients = [];

  return assembleEmail(emailEvent)
    .then(email => (
      Promise.all(to.map((recipient) => {
        const finalSesParams = Object.assign({}, email, {
          Destination: { ToAddresses: [recipient] },
        });
        return ses.sendEmail(finalSesParams).promise().then(
          () => sentRecipients.push(recipient) && logger.info(`Sent email ${id} to ${recipient}`),
          () => failedRecipients.push(recipient) && logger.error(`Failed to send email ${id} to ${recipient}`)
        );
      }))
    ))
    .then(publishEmailEvent('email-sent', id, sentRecipients))
    .then(publishEmailEvent('email-failed', id, failedRecipients))
    .catch((err) => {
      logger.error(`Failed to fetch email with id: ${id} from s3 with error ${err}`);
      return publishEmailEvent('email-failed', id, to)();
    });
};

module.exports = sendEmail;
