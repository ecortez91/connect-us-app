import React, { useEffect, useState } from "react";
import ActiveUsersList from "./components/ActiveUsersList/ActiveUsersList";
import * as webRTCHandler from "../utils/webRTC/webRTCHandler";
import DirectCall from './components/DirectCall/DirectCall'
import { connect } from 'react-redux';
import DashboardInformation from "./components/DashboardInformation/DashboardInformation";
import { callStates } from "../store/actions/callActions";
import axios from 'axios';
import Chat from "./components/Chat/Chat";

import './Dashboard.css';
import { setTurnServes } from "../utils/webRTC/TURN";

const Dashboard = ( {username, callState} ) => {
  useEffect(() => {
    const serverUrl = process.env.REACT_APP_LOCALHOST;
    axios.get(`${serverUrl}/api/get-turn-credentials`).then(
      responseData => {
        console.log(responseData);
        setTurnServes(responseData.data.token.iceServers);
        webRTCHandler.getLocalStream();
      }
    ).catch(err => console.log(err));
  }, []);
  const [messageList, setMessageList] = useState([]);

 const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!username) {
    window.location.href = "/";
  }

    return (
        <div className="dashboard_container background_main_color">
            <div className="dashboard_left_section">
                <div className="dashboard_content_container">
                  <DirectCall messageList={messageList} setMessageList={setMessageList}/>
                  { callState !== callStates.CALL_IN_PROGRESS && <DashboardInformation username={username} /> }
                </div>
                <a href="#" onClick={handleLogout} style={ { paddingLeft: '25px', textDecoration:'none', color: 'whitesmoke', cursor:'pointer'} }>Click here to Logout</a>
            </div>
        { <Chat messageList={messageList} setMessageList={setMessageList} /> }
            <div className="dashboard_right_section background_secondary_color">
              <div className="dashboard_active_users_list">
                <ActiveUsersList username={username} messageList={messageList} setMessageList={setMessageList}/>
              </div>
              <div className="dashboard_logo_container">
                Connect Us! 
              </div>
            </div>
        </div>
    );
};

const mapStateToProps = ( { call, dashboard } ) => ({
  ...call,
  ...dashboard
});

export default connect(mapStateToProps)(Dashboard);