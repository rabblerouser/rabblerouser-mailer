const aws = require('aws-sdk');
const config = require('../config');
const sendRegistrationEmail = require('../sendRegistrationEmail');

describe('sendRegistrationEmail', () => {
  let sandbox;
  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('sends an email with default messaging using SES', () => {
    const sendEmail = sinon.spy();
    sandbox.stub(aws, 'SES').returns({ sendEmail });
    config.emailFromAddress = 'admin@rr.com';

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
});
