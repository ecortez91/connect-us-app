import socketClient from 'socket.io-client';
import store from '../../store/store';
import * as dashboardActions from '../../store/actions/dashboardActions';
import * as webRTCHandler from '../webRTC/webRTCHandler';

const SERVER = process.env.REACT_APP_LOCALHOST;

const broadcastEventTypes = {
    ACTIVE_USERS: 'ACTIVE_USERS',
};

let socket;

export const connectWithWebSocket = () => {
    socket = socketClient(SERVER);
    socket.on('connection', () => {
        console.log("successfully connected with wss server");
        console.log(socket.id);
    });

    socket.on('broadcast', (data) => {
        handleBroadcastEvents(data)
    });

    //listener related with direct call
    socket.on('pre-offer', (data) => {
        webRTCHandler.handlePreOffer(data);
    });

    socket.on('pre-offer-answer', (data) => {
        webRTCHandler.handlePreOfferAnswer(data);
    });

    socket.on('webRTC-offer', (data) => {
        webRTCHandler.handleOffer(data);
    });

    socket.on('webRTC-answer', (data) => {
        webRTCHandler.handleAnswer(data);
    });

    socket.on('webRTC-candidate', (data) => {
        webRTCHandler.handleCandidate(data);
    });

    socket.on('user-hanged-up', () => {
        webRTCHandler.handleUserHangedUp();
    });
};

export const registerNewUser = (username) => {
    socket.emit('register-new-user', {
        username: username,
        socketId: socket.id
    });
};

export const sendPreOffer = (data) => {
    socket.emit('pre-offer', data);
}

export const sendPreOfferAnswer = (data) => {
    socket.emit('pre-offer-answer', data);
}

export const sendWebRTCOffer = (data) => {
    socket.emit('webRTC-offer', data);
}

export const sendWebRTCAnswer = (data) => {
    socket.emit('webRTC-answer', data);
}

export const sendWebRTCCandidate = (data) => {
    socket.emit('webRTC-candidate', data);
}

export const sendUserHangedUp = (data) => {
    socket.emit('user-hanged-up', data);
}

const handleBroadcastEvents = (data) => {
    switch (data.event) {
        case broadcastEventTypes.ACTIVE_USERS:
            const activeUsers = data.activeUsers.filter(activeUser => activeUser.socketId !== socket.id);
            store.dispatch(dashboardActions.setActiveUsers(activeUsers));
            break;
        default:
            break;
    }
}