import React, { useEffect } from "react";
import ActiveUsersList from "./components/ActiveUsersList/ActiveUsersList";
import * as webRTCHandler from "../utils/webRTC/webRTCHandler";
import DirectCall from './components/DirectCall/DirectCall'
import { connect } from 'react-redux';
import DashboardInformation from "./components/DashboardInformation/DashboardInformation";
import { callStates } from "../store/actions/callActions";
import axios from 'axios';

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
        //webRTCHandler.getLocalAudioStream();

        // Sadly ran out of time to implement audio calls inside the webapp, but I have a workaround ready for you to test them :)
        // In order to test audio-only calls, uncomment line 21 here in Dashboard.js, reload the app and now the calls will be done audio-only :D
        // I also added the functionality to "turn off/on camera" (for video-audio calls) to simulate "audio-only calls"
        // And added the "mute/unmute" logic as well (works on both call types, video-audio and audio-only)

        //Thanks for taking the time to test this app, it was a fun 3 day challenge :D

      }
    ).catch(err => console.log(err));
  }, []);

 const handleLogout = () => {
    window.location.href = "/";
  };

  if (!username) {
    window.location.href = "/";
  }

    return (
        <div className="dashboard_container background_main_color">
            <div className="dashboard_left_section">
                <div className="dashboard_content_container">
                  <DirectCall />
                  { callState !== callStates.CALL_IN_PROGRESS && <DashboardInformation username={username} /> }
                </div>
                <a href="#" onClick={handleLogout} style={ { paddingLeft: '25px', textDecoration:'none', color: 'whitesmoke', cursor:'pointer'} }>Click here to Logout</a>
            </div>
            <div className="dashboard_right_section background_secondary_color">
              <div className="dashboard_active_users_list">
                <ActiveUsersList /> 
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