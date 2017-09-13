// This script creates a kinesis stream for local development.
// In production, this job should be done by e.g. terraform.

const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const emailFixturePath = path.join(__dirname, 'mimeFile.txt');
const emailData = fs.readFileSync(emailFixturePath, 'utf-8');

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

const s3Endpoint = process.env.S3_ENDPOINT;
const emailsBucket = process.env.S3_EMAILS_BUCKET;

const s3 = new AWS.S3({
  endpoint: s3Endpoint,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'ALSO FAKE',
});

s3.createBucket({ 
  Bucket: emailsBucket 
})
.promise()
.then(() => {
  return s3.putObject({ 
    Key: 'email-from-john', 
    Bucket: emailsBucket, 
    Body: emailData 
  })
  .promise()
  .then(() => console.log('email uploaded...'));
})
.catch(error => {
  console.error(`Could not upload the email file: ${error.message}`);
  process.exit(1);
});
