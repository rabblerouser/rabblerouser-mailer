# Rabble Rouser Mailer

[![Build Status](https://travis-ci.org/rabblerouser/mailer.svg?branch=master)](https://travis-ci.org/rabblerouser/mailer)


This service sends emails using SES, in response to `send-email` events from the main stream. It should not know any
domain / business information about why it is sending those emails. It simply receives the generic requests and fulfils
them.

## Setup

1. Install Docker:
  - [for Mac](https://docs.docker.com/docker-for-mac/)
  - [for Windows](https://docs.docker.com/docker-for-windows/)
  - [for Linux](https://docs.docker.com/engine/installation/linux/)

2. Start a Docker container to develop in (this also starts containers for dependent services):

        `bin/dev-environment` # For Mac/Linux
        # Windows not supported yet :(

---

* To simulate a `send-email` event (this will not trigger a real email to be sent -
  everything is local only):

1. Run the application locally:

        `bin/local`

2. Open up a second terminal, and run:

        `bin/simulate`

3. Verify that the email 'sent' correctly by inspecting the files created inside the `sent-emails` directory.

## SES Setup

When you start with SES, your AWS account is in sandbox mode, which greatly limits who you can send emails to and from.
This is for spam protection, and getting out of the sandbox means contacting AWS support and telling them what you're
going to use it for.

While in the sandbox, you can only send emails *to* addresses that you own, which you verify by clicking a special link
in an email sent to that address. Additionally, you can only send emails *from* domains that you have verified (this
applies outside of the sandbox as well; you can't just send an email as anyone you like!)

The sandbox is good for test environments - it means you put any email address you like into forms, and it won't email
that person. But if you put your own verified email address in, you can receive the email and see that it works.

Both the domain and email address verification are manual processes done through the AWS SES console in your browser.
The steps are:

 1. Add a sender domain to SES
 2. Verify domain ownership by adding special DNS entries. If the domain you're verifying is one that you have in
 Route53, AWS will automatically create the entries for you, so it verifies itself with just a few clicks.
 3. Add a recipient email address to SES (one that you have access to)
 4. Verify the address by clicking the link in the email that AWS sends you
