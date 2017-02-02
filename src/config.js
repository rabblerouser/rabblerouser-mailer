module.exports = {
  eventAuthToken: process.env.EVENT_AUTH_TOKEN || 'secret',
  sesRegion: 'us-east-1',
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS,

  registrationSubject: process.env.REGISTRATION_SUBJECT || 'Thanks for joining!',
  registrationBody: process.env.REGISTRATION_BODY || "We're excited to have you on board.",
}
