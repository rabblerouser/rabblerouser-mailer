const logger = require('./logger');
const nodemailer = require('./nodemailer');
const streamClient = require('./streamClient');
const s3MailParser = require('./s3MailParser.js');

const publishEmailEvent = (eventType, emailId, recipients) => () => {
  if (!recipients.length) { return Promise.resolve(); }

  return streamClient.publish(eventType, { emailId, to: recipients })
    .catch(() => {
      logger.error(`Failed to publish ${eventType} event: { emailId: ${emailId}, to: ${recipients} }`);
    });
};

const assembleEmail = (emailEvent) => {
  const { from, subject, body, bodyLocation } = emailEvent;

  if (body) {
    return Promise.resolve({ from, subject, text: body, html: body });
  }
  return s3MailParser.parse(bodyLocation).then(({ text, html, attachments }) => (
    { from, subject, text, html, attachments }
  ));
};

const sendEmail = (emailEvent) => {
  const { to, id } = emailEvent;

  const sentRecipients = [];
  const failedRecipients = [];

  return assembleEmail(emailEvent)
    .then(nodemailerParams => (
      Promise.all(to.map(recipient => (
        nodemailer.sendMail({ ...nodemailerParams, to: [recipient] })
          .then(
            () => sentRecipients.push(recipient) && logger.info(`Sent email ${id} to ${recipient}`),
            err => failedRecipients.push(recipient) && logger.error(`Failed to send email ${id} to ${recipient} with error: ${err}`)
          )
      )))
    ))
    .then(publishEmailEvent('email-sent', id, sentRecipients))
    .then(publishEmailEvent('email-failed', id, failedRecipients))
    .catch((err) => {
      logger.error(`Failed to fetch email with id: ${id} from s3 with error ${err}`);
      return publishEmailEvent('email-failed', id, to)();
    });
};

module.exports = sendEmail;
