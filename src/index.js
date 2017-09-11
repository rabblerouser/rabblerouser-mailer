const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const logger = require('./logger');
const streamClient = require('./streamClient');
const sendEmail = require('./sendEmail');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

streamClient.on('send-email', sendEmail);
app.post('/events', streamClient.listen());

const listeningPort = process.env.PORT || 3001;

app.listen(listeningPort, () => {
  logger.info(`Listening for events on port ${listeningPort}`);
});
