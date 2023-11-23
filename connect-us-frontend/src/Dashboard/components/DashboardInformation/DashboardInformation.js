import React from 'react';

import { useHistory } from 'react-router-dom';
import './DashboardInformation.css';

const DashboardInformation = ({ username }) => {

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className='dashboard_info_text_container'>
      <span className='dashboard_info_text_title'>
        Hey {username} welcome to Connect Us!
      </span>
      <span className='dashboard_info_text_description'>
        Made by Eduardo Cortez 
      </span>
        <div onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default DashboardInformation;
