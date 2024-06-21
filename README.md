# Ghostmail

### The problem
Developers need a simple mail server to use in their development environments. This server should be able to catch all the emails sent from the app, and provide a simplistic interface to see the incoming messages.

### This solution
Ghostmail sets up a smtp server that will catch all emails sent to the address connected to the authentication parameters in the smtp connection string, regardless of what the actual domain is for them incoming message.

