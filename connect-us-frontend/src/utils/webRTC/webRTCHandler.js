import store from '../../store/store';
import { resetCallDataState, callStates, setCallRejected, setCallState, setCallerUsername, setCallingDialogVisible, setLocalStream, setRemoteStream, setMessage } from "../../store/actions/callActions";
import * as wss from '../wssConnection/wssConnection';
import { getTurnServers } from './TURN';

const preOfferAnswers = {
    CALL_ACCEPTED: 'CALL_ACCEPTED',
    CALL_REJECTED: 'CALL_REJECTED',
    CALL_NOT_AVAILABLE: 'CALL_NOT_AVAILABLE'
}

const defaultConstrains = {
    video: true,
    audio: true
};

const audioConstraints = {
    video: false,
    audio: true
};


export const getLocalStream = (activeUser) => {
    navigator.mediaDevices.getUserMedia(defaultConstrains)
    .then(stream => {
        store.dispatch(setLocalStream(stream));
        store.dispatch(setCallState(callStates.CALL_AVAILABLE));
        createPeerConnection();
    }).then( () => {
        if (activeUser)
            callToOtherUser(activeUser, 'VIDEO');
    })
    .catch(err => {
        console.log('error, error occurred while trying to get an access to get local stream');
        console.log(err);
    });
};

export const getLocalAudioStream = (activeUser) => {
    navigator.mediaDevices.getUserMedia(audioConstraints)
    .then(stream => {
        store.dispatch(setLocalStream(stream));
        store.dispatch(setCallState(callStates.CALL_AVAILABLE));
        createPeerConnection();
    }).then( () => {
        navigator.mediaDevices.getUserMedia(defaultConstrains)
        .then(stream => {
            store.dispatch(setLocalStream(stream));
        });
        callToOtherUser(activeUser, 'AUDIO');
    })
    .catch(err => {
        console.log('error, error occurred while trying to get an access to get local audio stream');
        console.log(err);
    });
};

let peerConnection;
let connectedUserSocketId;
let dataChannel;

export const callToOtherUser = (calleeDetails) => {
    connectedUserSocketId = calleeDetails.socketId;
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
    store.dispatch(setCallingDialogVisible(true));
    wss.sendPreOffer({
        callee:calleeDetails,
        caller: {
            username: store.getState().dashboard.username
        }
    });

    wss.setUsernameBusy({
        username:store.getState().dashboard.username,
    });
    wss.setUsernameBusy({
        username:calleeDetails.username,
    });
};

const createPeerConnection = () => {
    const turnServers = getTurnServers();
    const configuration = {
        iceServers: [...turnServers, { urls:'stun:stun.1und1.de:3478' }],   //url grabbed from https://gist.github.com/mondain/b0ec1cf5f60ae726202e
        iceTransportPolicy: 'relay'
        
    };

    peerConnection = new RTCPeerConnection(configuration);

    const localStream = store.getState().call.localStream;

    for (const track of localStream.getTracks()) {
        peerConnection.addTrack(track, localStream);
    }

    peerConnection.ontrack = ({streams: [stream]}) => {
        store.dispatch(setRemoteStream(stream));
    };

    peerConnection.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannel.onopen = () => {
            console.log('peer connection is read to receive data channel messages');
        };

        dataChannel.onmessage = (event) => {
            store.dispatch(setMessage(true, event.data));
        };
    };

    dataChannel = peerConnection.createDataChannel('chat');
    dataChannel.onopen = () => {
        console.log('chat data channel successfully opened');
    };
    
    peerConnection.onicecandidate = (event) => {
        console.log("getting candidates from stun server");
        if (event.candidate) {
            wss.sendWebRTCCandidate({
                candidate: event.candidate,
                connectedUserSocketId: connectedUserSocketId 
            });
        }
    };

    peerConnection.onconnectionstatechange = (event) => {
        if (peerConnection.connectionState === 'connected') {
            console.log('successfully connected with other peer');
        }
    };
};

export const handlePreOffer = (data) => {
    navigator.mediaDevices.getUserMedia(defaultConstrains)
    .then(stream => {
        store.dispatch(setLocalStream(stream));
    });
    if (checkIfCallIsPossible()) {
        connectedUserSocketId = data.callerSocketId;
        store.dispatch(setCallerUsername(data.callerUsername));
        store.dispatch(setCallState(callStates.CALL_REQUESTED));
    } else {
        wss.sendPreOfferAnswer( {
            callerSocketId: data.callerSocketId,
            answer: preOfferAnswers.CALL_NOT_AVAILABLE
        });
    }
};

export const rejectIncomingCallRequest = () => {
    wss.sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId,
        answer: preOfferAnswers.CALL_REJECTED
    });
    wss.setUsernameNormal(store.getState().dashboard.username);
    resetCallData();
};

export const acceptIncomingCallRequest = () => {
    wss.sendPreOfferAnswer({
        callerSocketId: connectedUserSocketId,
        answer: preOfferAnswers.CALL_ACCEPTED
    });
    store.dispatch(setCallState(callStates.CALL_IN_PROGRESS));
};

export const handlePreOfferAnswer = (data) => {
    store.dispatch(setCallingDialogVisible(false));

    if (data.answer === preOfferAnswers.CALL_ACCEPTED) {
        sendOffer();
    } else {
        let rejectionReason;
        if (data.answer === preOfferAnswers.CALL_NOT_AVAILABLE) {
            rejectionReason = 'Callee is not able to pick up the call right now';
        } else {
            rejectionReason = 'Call rejected by the callee';
        }
        store.dispatch(setCallRejected({
            rejected: true,
            reason: rejectionReason
        }));
        resetCallData();
    }
}

const sendOffer = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    wss.sendWebRTCOffer({
        calleeSocketId: connectedUserSocketId,
        offer: offer
    });
};

export const handleOffer = async (data) => {
    await  peerConnection.setRemoteDescription(data.offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    wss.sendWebRTCAnswer({
        callerSocketId: connectedUserSocketId,
        answer: answer
    });
};

export const handleAnswer = async (data) => {
    await peerConnection.setRemoteDescription(data.answer);
};

export const handleCandidate = async (data) => {
    try {
        console.log('adding ice candidates', data.candidate);
        await peerConnection.addIceCandidate(data.candidate);
    } catch (err) {
        console.error('error occurred when trying to add received ice candidate', err);
    }
};

export const checkIfCallIsPossible = () => {
    if (store.getState().call.localStream === null || store.getState().call.callState !== callStates.CALL_AVAILABLE) {
        return false;
    } else {
        return true;
    }
};

export const handleUserHangedUp = () => {
    resetCallDataAfterHangUp();
    wss.setUsernameNormal(store.getState().dashboard.username);
}

export const hangUp = () => {
    wss.sendUserHangedUp({
        connectedUserSocketId: connectedUserSocketId
    });

    resetCallDataAfterHangUp();
}

const resetCallDataAfterHangUp = () => {
    store.dispatch(resetCallDataState());
    peerConnection.close();
    peerConnection = null;
    createPeerConnection();
    resetCallData();
    const localStream = store.getState().call.localStream;
    if (localStream.getVideoTracks()[0] !== undefined) localStream.getVideoTracks()[0].enabled = true;
    localStream.getAudioTracks()[0].enabled = true;
}

export const resetCallData = () => {
    connectedUserSocketId = null;
    store.dispatch(setCallState(callStates.CALL_AVAILABLE));
};

export const sendMessageUsingDataChannel = (message) => {
    dataChannel.send(message);
}