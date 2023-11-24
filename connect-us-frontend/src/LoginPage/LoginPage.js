import React, { useState } from 'react';
import { connect } from 'react-redux';

import UsernameInput from './components/UsernameInput';
import SubmitButton from './components/SubmitButton';
import { useHistory } from 'react-router-dom';
import { setUsername, setAvatarUrl } from '../store/actions/dashboardActions';
import { registerNewUser } from '../utils/wssConnection/wssConnection';

import './LoginPage.css';

const LoginPage = ({ saveUsername, saveAvatarURL }) => {
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const history = useHistory();

  const handleSubmitButtonPressed = () => {
    history.push('/dashboard');
    registerNewUser(username, avatarUrl);
    saveUsername(username);
    saveAvatarURL(avatarUrl);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='login-page_container background_main_color'>
      <div className='login-page_login_box background_secondary_color'>
        <div className='login-page_title_container'>
          <h2>Welcome to Connect Us!</h2>
        </div>
        <UsernameInput username={username} setUsername={setUsername} />
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i> Select Avatar
        </label>
        <input id="file-upload" className="login-page_input" type="file" accept="image/*" onChange={handleAvatarChange} title='Select Avatar' alt='Select Avatar' />
        <SubmitButton handleSubmitButtonPressed={handleSubmitButtonPressed} />
      </div>
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    saveUsername: username => dispatch(setUsername(username)),
    saveAvatarURL: avatarUrl => dispatch(setAvatarUrl(avatarUrl)),
  };
};

export default connect(null, mapActionsToProps)(LoginPage);
