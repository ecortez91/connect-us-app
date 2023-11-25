import React from 'react';
import userAvatar from '../../../resources/userAvatar.png';
import { callToOtherUser } from '../../../utils/webRTC/webRTCHandler';
import { callStates } from '../../../store/actions/callActions';
import ConversationButton from '../ConversationButtons/ConversationButton';

const ActiveUsersListItem = (props) => {
  const { activeUser, callState } = props;

  const handleListItemPressed = () => {
    if (callState === callStates.CALL_AVAILABLE) {
      callToOtherUser(activeUser);
    }
  };

  return (
    <div className='active_user_list_item' onClick={handleListItemPressed}>
      <div className='active_user_list_image_container'>
        <img className='active_user_list_image' src={activeUser.avatarUrl || userAvatar} alt={activeUser.username}/>
      </div>
      <span className='active_user_list_text'>{activeUser.username}</span>
      {/**
          <ConversationButton onClickHandler={handleListItemPressed} name={'AUDIO'}>
          🎤
          </ConversationButton>
          <ConversationButton onClickHandler={handleListItemPressed} name={'VIDEO'} >
          🎥
          </ConversationButton>
      */}
    </div>
  );
};

export default ActiveUsersListItem;
