const fs = require('fs');
const path = require('path');
const config = require('../config');
const s3 = require('../s3');
const s3BodyBuilder = require('../s3BodyBuilder').build;

const emailFixturePath = path.join(__dirname, 'fixtures', 'mimeFile.txt');
const emailFixture = fs.readFileSync(emailFixturePath, 'utf-8');

config.s3EmailBucket = 'email-bucket';

describe('s3BodyBuilder', () => {
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

    return s3BodyBuilder({ key: 's3://something.emailBodyLocation' })
    .then(() => {
      expect(s3.getObject).to.have.been.calledWith({
        Key: 's3://something.emailBodyLocation',
        Bucket: 'email-bucket',
      });
    });
  });

  it('should return the email body', () => {
    s3.getObject.returns(awsSuccess({ Body: emailFixture }));

    return s3BodyBuilder({ key: 'emailBodyLocation' }).then((emailBody) => {
      expect(emailBody).to.equal('<div dir="ltr">I am an email.</div>\n');
    });
  });

  it('should fail if the mime file is not found', () => {
    s3.getObject.returns(awsFailure('Not found'));

    return s3BodyBuilder({ key: 'emailBodyLocation' }).catch((err) => {
      expect(err.message).to.equal('Failed to get and parse S3 object "email-bucket/emailBodyLocation": Not found');
    });
  });
});
