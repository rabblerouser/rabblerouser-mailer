const aws = require('aws-sdk');
const config = require('../config');
const sendRegistrationEmail = require('../sendRegistrationEmail');

describe('sendRegistrationEmail', () => {
  let sandbox;
  let sendEmail;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sendEmail = sinon.spy();
    sandbox.stub(aws, 'SES').returns({ sendEmail });
    config.emailFromAddress = 'admin@rr.com';
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('sends an email with default messaging using SES', () => {
    sendRegistrationEmail('new@member.com')

    expect(sendEmail).to.have.been.calledWith({
      Source: 'admin@rr.com',
      ReplyToAddresses: ['admin@rr.com'],
      Destination: { ToAddresses: ['new@member.com'] },
      Message: {
        Subject: { Data: 'Thanks for joining!' },
        Body: {
          Text: { Data: "We're excited to have you on board." },
        },
      },
    });
  });

  it('returns a resolved promise if SES succeeds', () => {
    const result = sendRegistrationEmail('new@member.com');

    cb = sendEmail.args[0][1];
    cb(null, 'Email sent!');

    return result;
  });

  it('returns a rejected promise if SES succeeds', () => {
    const result = sendRegistrationEmail('new@member.com');

    cb = sendEmail.args[0][1];
    cb('Email sending failed!');

    return result.then(() => {
      throw new Error('Should not have got here');
    }, () => {
      // Expected this error
    });
  });
});
