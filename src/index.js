const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const logger = require('./logger');
const streamClient = require('./streamClient');
const sendRegistrationEmail = require('./sendRegistrationEmail');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json());

streamClient.on('member-registered', sendRegistrationEmail);
app.post('/events', streamClient.listen());

app.listen(3001, () => {
  logger.info('Listening for events');
});
