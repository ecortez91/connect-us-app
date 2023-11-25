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


# Requirements
- Node.js v14.17.6, download link: [(Node.js v14.17.6)](https://nodejs.org/dist/v14.17.6/)
- A microphone and a webcam connected to the computer


# Installing steps in Windows:

- Download this repo
- Add the ```.env``` file (sent via email) into the backend app (root folder of ```contact-us-server```)
- Go to the contact-us-server folder and using the terminal install the packages executing: ```npm install```
- Start the server running: ```npm start```
- Go to the contact-us-frontend folder and using the terminal install the packages executing: ```npm install```
- Start the webapp running: ```npm start```
- If the webapp is not launched automatically, go to ```http://localhost:3000```


# How to test Connect Us App?

- Login with user1 in  ```http://localhost:3000``` (remember to select an avatar! if not, a default avatar will be used)
- Open a new tab and go to ```http://localhost:3000/```
- Login with user2
- You should see the other user connected in the user list
- Click the user1 in order to start a webRTC call
- Go to the user1 tab and a pop-up will appear where you can accept or reject the call, accept the call invitation from user2
- You can also reject the call and the caller will get notified with a pop-up
- A webRTC call is stablished
- You're able to chat with the other user as well (back and forth using a webRTC data channel [(RTCPeerConnection: createOffer() method)](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel))
- You have the option to make the call "AudioOnly" by disabling the video during the call
- You have the option to mute your microphone if needed during a call
- You also have the option to end the call
- You are able to see the users that are currently in a call (shown as "Busy")
- You won't be able to make a call to "Busy" users
- You have the option to logout from the app
- Users that "logout" are automatically removed from the "connected" list



# Images

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/355dee3d-3a5f-43d0-8987-7c3766f9d141)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/e126bd5a-5b42-4219-abf8-edcb75b2d034)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/51e9ec02-44e4-4f5e-8c78-b3b8ce1a1be3)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/ccd0aa1c-c428-44da-97e6-603ede27aa5c)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/80c40343-f109-47d3-b5d7-65eb0e7b1c96)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/822879a2-1c0c-4bd0-aab6-fa5d580a2ed2)

![image](https://github.com/ecortez91/connect-us-app/assets/7227006/115def1f-1972-4c98-a50d-5244889345f3)
