import React from 'react';
import userAvatar from '../../../resources/userAvatar.png';
import { getLocalAudioStream, getLocalStream } from '../../../utils/webRTC/webRTCHandler';
import ConversationButton from '../ConversationButtons/ConversationButton';

const ActiveUsersListItem = (props) => {
  const { activeUser } = props;

  const handleListItemPressed = (e) => {
      if (e.target.value === 'VIDEO') {
        getLocalStream(activeUser);
      } else {
        getLocalAudioStream(activeUser);
      }
  };

  return (
    <div className='active_user_list_item'>
      <div className='active_user_list_image_container'>
        <img className='active_user_list_image' src={activeUser.avatarUrl || userAvatar} alt={activeUser.username}/>
      </div>
      <span className='active_user_list_text'>{activeUser.username}</span>
          <ConversationButton onClickHandler={handleListItemPressed} name={'AUDIO'}>
          🎤
          </ConversationButton>
          <ConversationButton onClickHandler={handleListItemPressed} name={'VIDEO'} >
          🎥
          </ConversationButton>
    </div>
  );
};

export default ActiveUsersListItem;
