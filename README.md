# rabblerouser-mailer
Sends emails using AWS SES in response to the following events:

 - `member-registered`

## Setup

```sh
npm install
```

## Run the tests
```sh
npm test
```

## Run the app
```sh
npm start
```

If you want to test it manually, you first need to do the SES setup mentioned below, configure your AWS credentials. Then you can try testing it locally like this:

```sh
curl -X POST -H 'Content-Type: application/json' localhost:3001/mail -d '{ "type": "member-registered", "data": { "email": "anEmail@example.com" } }'
```

## SES Setup

TODO
