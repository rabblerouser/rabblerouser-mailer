const fs = require('fs');
const simpleParser = require('mailparser').simpleParser;

describe('sendLargeEmail', () => {
  it('it sends a large email (using S3)', (done) => {
    fs.readFile('email-samples/with-attachment', (err, data) => {
      simpleParser(data, (err, mail)=>{
        expect(mail.subject).to.equal("pam testing this now!");
        done();
      });
    });
  });
});
