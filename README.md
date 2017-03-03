# Rabble Rouser Mailer
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

If you want it to work locally, so you can test it manually, then you need to do some manual set up of SES - see below
for instructions. Once you've done that, configure your AWS credentials as normal, and then start it like this:

```sh
EMAIL_FROM_ADDRESS='sender@ses-verified-domain.com' npm start
```

You can send it an email request like this:

```sh
curl -X POST -H 'Content-Type: application/json' -H 'Authorization: secret' localhost:3001/mail -d '{ "type": "member-registered", "data": { "email": "ses-verified-address@example.com" } }'
```

Alternatively you can run it with Docker. After doing `npm install`, you can build it with:

```sh
docker build -t rabblerouser/mailer .
```

Then you can run it with:

```
docker run -p 3001:3001 --e EMAIL_FROM_ADDRESS='sender@ses-verified-domain.com' -e AWS_ACCESS_KEY_ID=ABC123 -e AWS_SECRET_ACCESS_KEY=DEF456 rabblerouser/mailer -t --name rabblerouser-mailer
```

## SES Setup

When you start with SES, your AWS account is in sandbox mode, which greatly limits who you can send emails to and from.
This is for spam protection, and getting out of the sandbox means contacting AWS support and telling them what you're
going to use it for.

While in the sandbox, you can only send emails *to* addresses that you have been verified, by clicking a special link in
an email that is sent to that address. Additionally, you can only send emails *from* domains that you have verified. The
latter is true outside of the sandbox as well; you can't just send an email as anyone you like.

The sandbox is good for test environments - it means you put any email address you like into forms, and it won't be able
to email that person. But if you put your own verified email address in, you can receive the email and see that it works.

Both the domain and email address verification are manual processes which you can do through the AWS SES console in your
browser. The steps are:

 1. Add a sender domain to SES
 2. Verify domain ownership by adding special DNS entries. If the domain you're verifying is one that you have in Route53,
 then it will manually create the entries for you, meaning it essentially verifies itself with just a few clicks.
 3. Add a recipient email address to SES (one that you have access to)
 4. Verify the address by clicking the link in the email that AWS sends you
