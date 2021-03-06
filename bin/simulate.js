const createClient = require('@rabblerouser/stream-client');

const streamClient = createClient({
  publishToStream: process.env.STREAM_NAME,
  kinesisEndpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'FAKE',
});

const event = {
  id: 'some-random-id',
  from: 'campaigns@rabblerouser.team',
  to: ['john@example.com', 'jane@example.com'],
  subject: 'Do the thing!',
  body: 'It is very important that you do the thing.',
};

streamClient.publish('send-email', event)
  .then(data => console.log('send-email event succesfuly published:', data))
  .catch(error => {
    console.log('send-email event publishing failed:', error)
    process.exit(1);
  });

const largeEmailEvent = {
  id: 'some-random-id',
  from: 'campaigns@rabblerouser.team',
  to: ['pam@example.com'],
  subject: 'This email body is coming to you from S3!',
  bodyLocation: {
    key: 'email-from-john',
  },
};

streamClient.publish('send-email', largeEmailEvent)
  .then(data => console.log('send-email event succesfuly published:', data))
  .catch(error => {
    console.log('send-email event publishing failed:', error)
    process.exit(1);
  });