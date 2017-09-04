const fs = require('fs');
const path = require('path');

const config = require('../config');
config.s3EmailBucket = 'email-bucket';

const s3 = require('../s3');
const s3BodyBuilder = require('../s3BodyBuilder').build;

const emailFixturePath = path.join(__dirname, 'fixtures', 'mimeFile.txt');
const emailFixture = fs.readFileSync(emailFixturePath, 'utf-8');

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

    return s3BodyBuilder('s3://something.emailBodyLocation')
    .then(() => {
      expect(s3.getObject).to.have.been.calledWith({
        Key: 's3://something.emailBodyLocation',
        Bucket: 'email-bucket',
      });
    });
  });

  it('should return the email body', () => {
    s3.getObject.returns(awsSuccess({ Body: emailFixture }));

    return s3BodyBuilder('emailBodyLocation').then((emailBody) => {
      expect(emailBody).to.equal('<div dir="ltr">I am an email.</div>\n');
    });
  });

  it('should fail if the mime file is not found', () => {
    s3.getObject.returns(awsFailure());

    return s3BodyBuilder('emailBodyLocation').catch((err) => {
      expect(err.message).to.equal('Email not found');
    });
  });
});
