const twilio = require('twilio');
const cors = require('cors');
const express = require('express');
const socket = require('socket.io');
require('dotenv').config();

const PORT = process.env.PORT|| 5000;

const app = express();

app.use(cors());
app.get('/', (req, res) => {
    res.send({ api: 'video-talker-api' });
});

app.get('/api/get-turn-credentials', (req, res) => {
    const accountSid = process.env.TWILIO_ACCOUNT_S_ID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    client.tokens.create().then((token) => res.send({ token }));
});

const server = app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

const io = socket(server, {
   cors: {
    origin: '*',
    methods: ['GET', 'POST']
   } 
});

let peers = [];
const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
};

io.on('connection', (socket) => {
    socket.emit('connection', null);
    console.log('new user connected');
    console.log(socket.id);
    socket.on('register-new-user', (data) => {
        peers.push({
            username: data.username,
            socketId: data.socketId
        });
        console.log("Registered new user");
        console.log(peers);
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: peers
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconected');
        peers = peers.filter(peer => peer.socketId !== socket.id);
        io.sockets.emit('broadcast', {
            event: broadcastEventTypes.ACTIVE_USERS,
            activeUsers: peers
        });
    });

    //listeners related with direct call
    socket.on('pre-offer', (data) => {
        console.log('pro-offer handled');
        io.to(data.callee.socketId).emit('pre-offer', {
            callerUsername: data.caller.username,
            callerSocketId: socket.id
        });
    });

    socket.on('pre-offer-answer', (data) => {
        console.log('handling pre offer answer');
        io.to(data.callerSocketId).emit('pre-offer-answer', {
            answer: data.answer
        });
    });

    socket.on('webRTC-offer', (data) => {
        console.log('handling webRTC offer');
        io.to(data.calleeSocketId).emit('webRTC-offer', {
            offer: data.offer
        });
    });

    socket.on('webRTC-answer', (data) => {
        console.log('handling webRTC answer');
        io.to(data.callerSocketId).emit('webRTC-answer', {
            answer: data.answer
        });
    });

    socket.on('webRTC-candidate', (data) => {
        console.log('handling ice candidate');
        io.to(data.connectedUserSocketId).emit('webRTC-candidate', {
            candidate: data.candidate
        });
    });

    socket.on('user-hanged-up', (data) => {
        console.log('handling user hang up');
        io.to(data.connectedUserSocketId).emit('user-hanged-up');
    });
   
});