module.exports = {
  sesRegion: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  eventAuthToken: process.env.EVENT_AUTH_TOKEN || 'secret',
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS,

  registrationSubject: process.env.REGISTRATION_SUBJECT || 'Thanks for joining!',
  registrationBody: process.env.REGISTRATION_BODY || "We're excited to have you on board.",
}
