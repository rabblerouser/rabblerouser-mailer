const express = require('express');
const bodyParser = require('body-parser');
const createClient = require('rabblerouser-stream-client');

const config = require('./config');
const sendRegistrationEmail = require('./sendRegistrationEmail')

const app = express();
app.use(bodyParser.json());

const streamClientSettings = {
  stream: 'TODO: Should not need this param',
  eventAuthToken: config.eventAuthToken,
};
const streamClient = createClient(streamClientSettings);

app.post('/mail', streamClient.consumer);

streamClient.consumer.on('member-registered', member => {
  sendRegistrationEmail(member.email);
});

app.listen(3001, () => {
  console.log('Listening for events');
});
