const express = require('express');
const socket = require('socket.io');

const PORT = 5000;

const app = express();

const server = app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
    console.log(`http://localhost:${PORT}`);
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
        console.log('handling pre ofer anser');
        io.to(data.callerSocketId).emit('pre-offer-answer', {
            answer: data.answer
        });
    });
});