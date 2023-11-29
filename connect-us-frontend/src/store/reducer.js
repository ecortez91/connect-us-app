import { combineReducers } from "redux";
import dashboardReducer from './reducers/dashboardReducer';
import callReducer from './reducers/callReducer';
import chatReducer from './reducers/chatReducer';

export default combineReducers({
    dashboard: dashboardReducer,
    call: callReducer,
    chat: chatReducer
});