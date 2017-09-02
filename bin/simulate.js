const createClient = require('@rabblerouser/stream-client');

const streamClient = createClient({
  publishToStream: process.env.STREAM_NAME,
  kinesisEndpoint: process.env.KINESIS_ENDPOINT,
  region: 'ap-southeast-2',
  accessKeyId: 'FAKE',
  secretAccessKey: 'FAKE',
});

const event = {
  id: 'some-random-id',
  from: 'campaigns@rabblerouser.team',
  to: ['john@example.com', 'jane@example.com'],
  subject: 'Do the thing!',
  body: 'It is very important that you do the thing.',
};
streamClient.publish('send-email', event);
