const express = require('express');
const bodyParser = require('body-parser');
const createClient = require('@rabblerouser/stream-client');

const config = require('./config');
const sendRegistrationEmail = require('./sendRegistrationEmail')

const app = express();
app.use(bodyParser.json());

const streamClientSettings = {
  listenWithAuthToken: config.listenerAuthToken,
};
const streamClient = createClient(streamClientSettings);

streamClient.on('member-registered', sendRegistrationEmail);
app.post('/events', streamClient.listen());

app.listen(3001, () => {
  console.log('Listening for events');
});
