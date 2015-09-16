p1webclient
===========
Web App Client 

#--> LOGIN AS 'bob' <--

This is because we are currently hardcoding groups to username 'bob' for our mock backend. Or like groups 'bob' is a part of. You can login as other people, there just won't be any messages created (because we created them ourselves in our mock backend).

The mock backend can be found in mock.js if you want to see some specifics on implementation and how we are supporting the API to the best of our ability.

#To get project up and running:
you need to have node, npm, bower, sass, ruby installed.

mkdir p1webclient

git clone

gem install animation --pre

npm install

bower install

grunt develop.mock


#Deliverable

For the final deliverable, the web client is still using the mock back-end as the server is still not functioning entirely properly. We could not get messages to work through the server or documents, so we have decided to show that the front-end client is functioning with all features in tact.

To make things a bit easier, we also changed a few endpoints in our mock back-end to take advantage of the body of a POST request instead of using query params.
