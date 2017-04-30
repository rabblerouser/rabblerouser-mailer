const config = require('../config');
const ses = require('../ses');
const sendRegistrationEmail = require('../sendRegistrationEmail');

describe('sendRegistrationEmail', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(ses, 'sendEmail').returns({ promise: () => {} });
    config.emailFromAddress = 'admin@rr.com';
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('sends an email with default messaging using SES', () => {
    sendRegistrationEmail({ email: 'new@member.com' });

    expect(ses.sendEmail).to.have.been.calledWith({
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
    ses.sendEmail.returns({ promise: () => Promise.resolve() });

    return sendRegistrationEmail({ email: 'new@member.com' });
  });

  it('returns a rejected promise if SES succeeds', () => {
    ses.sendEmail.returns({ promise: () => Promise.reject() });
    const result = sendRegistrationEmail({ email: 'new@member.com' });

    return result.then(() => {
      throw new Error('Should not have got here');
    }, () => {
      // Expected this error
    });
  });
});
