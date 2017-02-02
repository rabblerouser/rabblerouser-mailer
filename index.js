const express = require('express');
const bodyParser = require('body-parser');
const createClient = require('rabblerouser-stream-client');

const streamClientSettings = {
  stream: 'TODO: Should not need this param',
  eventAuthToken: process.env.EVENT_AUTH_TOKEN || 'secret',
};

const streamClient = createClient(streamClientSettings);

const app = express();
app.use(bodyParser.json());

app.post('/mail', streamClient.consumer);

streamClient.consumer.on('member-registered', member => {
  console.log('Sending mail to:', member.email);
});

app.listen(3001, () => {
  console.log('Listening for events');
});
