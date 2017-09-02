// const fs = require('fs');
// const util = require('util');
//
// const readFile = util.promisify(fs.stat);
//
// const simpleParser = require('mailparser').simpleParser;
//
// describe('sendLargeEmail', () => {
//   it('it sends a large email (using S3)', (done) => {
//     return readFile('email-samples/with-attachment')
//     .then(simpleParser)
//     .then(console.log)
//     .catch(console.log);
//   });
// });
