const aws = require('aws-sdk');
const config = require('./config');

const data = string => ({ Data: string });

const sendRegistrationEmail = email => {
  const ses = new aws.SES({
    region: config.sesRegion,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });

  const sesParams = {
    Source: config.emailFromAddress,
    ReplyToAddresses: [config.emailFromAddress],
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: data(config.registrationSubject),
      Body: {
        Text: data(config.registrationBody),
      },
    },
  };
  ses.sendEmail(sesParams, (err, res) => {
    if (err) {
      console.error('Failed to send email:', err);
    } else {
      console.log('Email sent:', res);
    }
  });
}

module.exports = sendRegistrationEmail;
