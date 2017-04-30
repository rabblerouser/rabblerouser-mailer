module.exports = {
  sesRegion: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  listenerAuthToken: process.env.LISTENER_AUTH_TOKEN || 'secret',

  emailFromAddress: process.env.EMAIL_FROM_ADDRESS,
};
