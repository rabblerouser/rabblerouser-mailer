const express = require('express');
const bodyParser = require('body-parser');

const sendRegistrationEmail = require('./sendRegistrationEmail')
const streamClient = require('./streamClient');

const app = express();
app.use(bodyParser.json());

streamClient.on('member-registered', sendRegistrationEmail);
app.post('/events', streamClient.listen());

app.listen(3001, () => {
  console.log('Listening for events');
});
