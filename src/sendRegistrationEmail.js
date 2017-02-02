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
  return new Promise((resolve, reject) => {
    ses.sendEmail(sesParams, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

module.exports = sendRegistrationEmail;
