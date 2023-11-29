import React from 'react';
import userAvatar from '../../../resources/userAvatar.png';
import { getLocalAudioStream, getLocalStream } from '../../../utils/webRTC/webRTCHandler';
import ConversationButton from '../ConversationButtons/ConversationButton';
import { chatTypes, getActions } from "../../../store/actions/chatActions";
import { connect } from "react-redux";

const ActiveUsersListItem = (props) => {
  const { activeUser, setChosenChatDetails } = props;

  const handleChooseActiveConversation = () => {
    setChosenChatDetails( { id: activeUser.socketId, name: activeUser.username }, chatTypes.DIRECT );
  }

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
          <ConversationButton onClickHandler={handleChooseActiveConversation} name={'CHAT'} >
          📱
          </ConversationButton>
          <ConversationButton onClickHandler={handleListItemPressed} name={'AUDIO'}>
          🎤
          </ConversationButton>
          <ConversationButton onClickHandler={handleListItemPressed} name={'VIDEO'} >
          🎥
          </ConversationButton>
    </div>
  );
};


const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};

export default connect(null, mapActionsToProps)(ActiveUsersListItem);