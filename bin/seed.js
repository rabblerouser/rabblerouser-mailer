// This script creates a kinesis stream for local development.
// In production, this job should be done by e.g. terraform.

const AWS = require('aws-sdk');

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
