const createClient = require('@rabblerouser/stream-client');
const config = require('./config');

const streamClient = createClient({
  publishToStream: config.streamName,
  listenWithAuthToken: config.listenerAuthToken,
  region: config.kinesisRegion,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  kinesisEndpoint: config.kinesisEndpoint,
});

module.exports = streamClient;
