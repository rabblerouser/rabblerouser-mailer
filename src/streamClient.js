const createClient = require('@rabblerouser/stream-client');
const config = require('./config');
const logger = require('./logger');

const streamClient = createClient({
  publishToStream: config.streamName,
  listenWithAuthToken: config.listenerAuthToken,
  region: config.kinesisRegion,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  kinesisEndpoint: config.kinesisEndpoint,
  logger,
});

module.exports = streamClient;
