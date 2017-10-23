module.exports = {
  sesRegion: process.env.SES_REGION || 'us-east-1',
  sesEndpoint: process.env.SES_ENDPOINT,
  kinesisRegion: process.env.KINESIS_REGION || 'ap-southeast-2',
  kinesisEndpoint: process.env.KINESIS_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'FAKE',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'FAKE',
  streamName: process.env.STREAM_NAME,
  listenerAuthToken: process.env.LISTENER_AUTH_TOKEN || 'secret',
  s3EmailBucket: process.env.S3_EMAILS_BUCKET || 'bucket',
  s3Endpoint: process.env.S3_ENDPOINT,
  s3Region: process.env.S3_REGION || 'ap-southeast-2',
};
