// This script creates a kinesis stream for local development.
// And adds a fake mime file to an S3 bucket.
// In production, this job should be done by e.g. terraform.
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = require('../src/s3');

let exitNow = false;

function listObjects() {
  s3.listObjects({ Bucket: 'rr-group-mailer' })
  .promise()
  .then((data) => {
    exitNow = true;
    console.log(data)
  })
  .catch((error) => {
    exitNow = true;
    console.log(error);
  });
}

const params = {
  Bucket: 'rr-group-mailer',
  Key: '012we3e35645ter',
  Body: fs.createReadStream('./email-samples/with-attachment'),
};

s3.putObject(params)
.promise()
.then(data => console.log(`${data} successfully uploaded`))
.then(listObjects)
.catch((error) => {
  console.log(error);
});

console.log('Creating kinesis stream for development');

const kinesis = new AWS.Kinesis({
  endpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

const StreamName = process.env.STREAM_NAME;
kinesis.createStream({ StreamName, ShardCount: 1 }).promise().then(
  () => console.log(`${StreamName} created`),
  (err) => {
    // Swallow these errors, but fail on all others
    if (err.message.includes('already exists')) {
      console.log(`${StreamName} already exists`);
      return;
    }
    console.error(`Could not create stream: ${err.message}`);
    process.exit(1);
  }
);


(function wait() {
  if (!exitNow) {
    console.log('waiting...');
    setTimeout(wait, 1000);
  }
}());
