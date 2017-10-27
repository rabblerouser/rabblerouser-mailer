const fs = require('fs');
const path = require('path');
const s3 = require('../s3');
const s3MailParser = require('../s3MailParser');

const emailFixturePath = path.join(__dirname, 'fixtures', 'mimeFile.txt');
const emailFixture = fs.readFileSync(emailFixturePath, 'utf-8');

describe('s3MailParser', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(s3, 'getObject');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const awsSuccess = data => ({ promise: () => Promise.resolve(data) });
  const awsFailure = error => ({ promise: () => Promise.reject(error) });

  it('should fetch the mime file from the S3 email bucket', () => {
    s3.getObject.returns(awsSuccess({ Body: emailFixture }));

    return s3MailParser.parse({ key: 's3://something.emailBodyLocation' }).then(() => {
      expect(s3.getObject).to.have.been.calledWith({
        Key: 's3://something.emailBodyLocation',
        Bucket: 'email-bucket',
      });
    });
  });

  it('should return the email text, html, and attachments', () => {
    s3.getObject.returns(awsSuccess({ Body: emailFixture }));

    return s3MailParser.parse({ key: 'emailBodyLocation' }).then((result) => {
      expect(result).to.eql({
        text: 'I am an email.\n',
        html: '<div dir="ltr">I am an email.</div>\n',
        attachments: [],
      });
    });
  });

  it('should fail if the mime file is not found', () => {
    s3.getObject.returns(awsFailure('Not found'));

    return s3MailParser.parse({ key: 'emailBodyLocation' }).catch((err) => {
      expect(err.message).to.equal('Failed to get and parse S3 object "email-bucket/emailBodyLocation": Not found');
    });
  });
});
