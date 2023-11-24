# Connect Us!

Welcome! Thanks for using connect-us-app, a video chat web app built using:
- React.js
- Node.js
- Socket.IO
- WebRTC
- Git
- Heroku


# What is Connect Us!?

This webapp even works on mobile phones as shown in the images below, it works with calls in the same network or different networks. With this app you're able to receive and make calls to other connected users securely. I've deployed the backend as well as the frontend into Heroku and it's up and running for you to test this app.


# Deployment made into Heroku (Demo site)

https://connect-us-frontend-8c648836da4c.herokuapp.com/


# Installing steps in Windows:

- Download this repo
- Add the ```.env``` file (sent via email) into the root folder in ```contact-us-server```
- Go to the contact-us-server folder and using the terminal install the packages executing: ```npm install```
- Start the server running: ```npm start```
- Go to the contact-us-frontend folder and using the terminal install the packages executing: ```npm install```
- Start the webapp running: ```npm start```
- If the webapp is not launched automatically, go to ```http://localhost:3000```


# How to test app once 

- Login with user1 in  ```http://localhost:3000```
- Open a new tab and go to ```http://localhost:3000/```
- Login with user2
- You should see the other user connected in the user list
- Click the user1 in order to start a webRTC call
- Accept the call invitation from user2
- A webRTC call is stablished and you're able to chat with the user as well
- You can also reject the call and the user will get notified
- Users that logout automatically are removed from the "connected" list


# Images

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/822879a2-1c0c-4bd0-aab6-fa5d580a2ed2)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/115def1f-1972-4c98-a50d-5244889345f3)
