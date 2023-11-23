import React from 'react';

import './DashboardInformation.css';

const DashboardInformation = ({ username }) => {
  return (
    <div className='dashboard_info_text_container'>
      <span className='dashboard_info_text_title'>
        Hey {username} welcome to Connect Us!
      </span>
      <span className='dashboard_info_text_description'>
        Made by Eduardo Cortez 
      </span>
    </div>
  );
};

export default DashboardInformation;
