import React, { useEffect } from "react";
import ActiveUsersList from "./components/ActiveUsersList/ActiveUsersList";
import * as webRTCHandler from "../utils/webRTC/webRTCHandler";
import DirectCall from './components/DirectCall/DirectCall'

import './Dashboard.css'

const Dashboard = () => {
  useEffect(() => {
    webRTCHandler.getLocalStream();
  }, []);

    return (
        <div className="dashboard_container background_main_color">
            <div className="dashboard_left_section">
                <div className="dashboard_content_container">
                  <DirectCall />
                </div>
                <div className="dashboard_rooms_container background_secondary_color">
                  Rooms
                </div>
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

export default Dashboard;