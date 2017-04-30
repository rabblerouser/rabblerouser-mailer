const config = require('./config');
const ses = require('./ses');

const data = string => ({ Data: string });

const sendRegistrationEmail = (member) => {
  const sesParams = {
    Source: config.emailFromAddress,
    ReplyToAddresses: [config.emailFromAddress],
    Destination: { ToAddresses: [member.email] },
    Message: {
      Subject: data('Thanks for joining!'),
      Body: {
        Text: data("We're excited to have you on board."),
      },
    },
  };
  return ses.sendEmail(sesParams).promise();
};

module.exports = sendRegistrationEmail;
