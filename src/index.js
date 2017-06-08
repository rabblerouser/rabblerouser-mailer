const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const logger = require('./logger');
const streamClient = require('./streamClient');
const sendEmail = require('./sendEmail');
// const sendLargeEmail = require('./sendLargeEmail');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

streamClient.on('send-email', sendEmail);
// streamClient.on('send-large-email', sendLargeEmail);
app.post('/events', streamClient.listen());

app.listen(process.env.PORT || 3001, () => {
  logger.info('Listening for events');
});
