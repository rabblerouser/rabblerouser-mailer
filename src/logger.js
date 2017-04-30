const winston = require('winston');

const level = process.env.NODE_ENV === 'test' ? -1 : 'debug';
const transports = [new (winston.transports.Console)()];

module.exports = new winston.Logger({ level, transports });
