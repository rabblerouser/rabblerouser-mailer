const sendEmail = require('../sendEmail');
const streamClient = require('../streamClient');
const nodemailer = require('../nodemailer');
const s3MailParser = require('../s3MailParser');

describe('sendEmail', () => {
  let sandbox;
  const emailEvent = {
    id: '123-456',
    from: 'campaigns@rabblerouser.team',
    to: ['john@example.com', 'jane@example.com'],
    subject: 'Do the thing!',
    body: 'It is very important that you do the thing.',
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(s3MailParser, 'parse');
    sandbox.stub(nodemailer, 'sendMail');
    sandbox.stub(streamClient, 'publish').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('when the email event includes a s3 object key', () => {
    const s3EmailEvent = {
      id: '123-456',
      from: 'campaigns@rabblerouser.team',
      to: ['john@example.com'],
      subject: 'Do the thing!',
      bodyLocation: 'theEmailIsHere',
    };
    const parsedEmail = {
      text: 'I am a long email',
      html: '<div>I am a long email</div>',
      attachments: ['PICTURE!'],
    };

    it('fetches the email body from s3', () => {
      nodemailer.sendMail.resolves();
      s3MailParser.parse.withArgs('theEmailIsHere').resolves(parsedEmail);

      return sendEmail(s3EmailEvent).then(() => {
        expect(nodemailer.sendMail).to.have.been.calledWith({
          from: 'campaigns@rabblerouser.team',
          to: ['john@example.com'],
          subject: 'Do the thing!',
          text: 'I am a long email',
          html: '<div>I am a long email</div>',
          attachments: ['PICTURE!'],
        });
      });
    });

    it('publishes a failure event if the body cannot be fetched or parsed', () => {
      s3MailParser.parse.rejects('Email not found');

      return sendEmail(s3EmailEvent).then(() => {
        expect(streamClient.publish).to.have.been.calledWith('email-failed', {
          emailId: '123-456',
          to: ['john@example.com'],
        });
        expect(streamClient.publish.callCount).to.eql(1);
      });
    });
  });

  describe('when the email event includes the body', () => {
    it('sends an email to each recipient', () => {
      nodemailer.sendMail.resolves();

      return sendEmail(emailEvent).then(() => {
        expect(nodemailer.sendMail).to.have.been.calledWith({
          from: 'campaigns@rabblerouser.team',
          to: ['john@example.com'],
          subject: 'Do the thing!',
          text: 'It is very important that you do the thing.',
          html: 'It is very important that you do the thing.',
        });
        expect(nodemailer.sendMail).to.have.been.calledWith({
          from: 'campaigns@rabblerouser.team',
          to: ['jane@example.com'],
          subject: 'Do the thing!',
          text: 'It is very important that you do the thing.',
          html: 'It is very important that you do the thing.',
        });
      });
    });
  });

  it('publishes a single event for all email successes', () => {
    nodemailer.sendMail.resolves();

    return sendEmail(emailEvent).then(() => {
      expect(streamClient.publish).to.have.been.calledWith('email-sent', {
        emailId: '123-456',
        to: ['john@example.com', 'jane@example.com'],
      });
      expect(streamClient.publish.callCount).to.eql(1);
    });
  });

  it('does not publish an email success event if they all failed', () => {
    nodemailer.sendMail.rejects();
    return sendEmail(emailEvent).then(() => {
      expect(streamClient.publish).not.to.have.been.calledWith('email-sent', sinon.match.any);
    });
  });

  it('publishes a single event for all email failures', () => {
    nodemailer.sendMail.rejects();
    return sendEmail(emailEvent).then(() => {
      expect(streamClient.publish).to.have.been.calledWith('email-failed', {
        emailId: '123-456',
        to: ['john@example.com', 'jane@example.com'],
      });
      expect(streamClient.publish.callCount).to.eql(1);
    });
  });

  it('does not publish an email failure event if they all succeeded', () => {
    nodemailer.sendMail.resolves();
    return sendEmail(emailEvent).then(() => {
      expect(streamClient.publish).not.to.have.been.calledWith('email-failed', sinon.match.any);
    });
  });

  it('continues sending emails when email sending fails', () => {
    nodemailer.sendMail.onCall(0).rejects();
    nodemailer.sendMail.onCall(1).resolves();

    return sendEmail(emailEvent).then(() => {
      expect(nodemailer.sendMail.callCount).to.eql(2);
    });
  });
});
