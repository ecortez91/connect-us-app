import store from '../../store/store';
import { callStates, setCallState, setLocalStream } from "../../store/actions/callActions";

const defaultConstrains = {
    video: true,
    audio: true
};

const audioConstraints = {
    video: false,
    audio: true
};


export const getLocalStream = () => {
    navigator.mediaDevices.getUserMedia(defaultConstrains)
    .then(stream => {
        store.dispatch(setLocalStream(stream));
        store.dispatch(setCallState(callStates.CALL_AVAILABLE));
    })
    .catch(err => {
        console.log('error, error ocurred while trying to get an access to get local stream');
        console.log(err);
    });
};