import React from 'react';
import userAvatar from '../../../resources/userAvatar.png';
import { getLocalAudioStream, getLocalStream } from '../../../utils/webRTC/webRTCHandler';
import ConversationButton from '../ConversationButtons/ConversationButton';
import { chatTypes, getActions } from "../../../store/actions/chatActions";
import { connect } from "react-redux";
import { joinRoom, socket } from '../../../utils/wssConnection/wssConnection';
import { useEffect } from 'react';

const ActiveUsersListItem = (props) => {
  const { activeUser, setChosenChatDetails, username } = props;

  const handleChooseActiveConversation = () => {
    setChosenChatDetails( { id: activeUser.socketId, name: activeUser.username, avatarUrl: activeUser.avatarUrl }, chatTypes.DIRECT );
    if (username !== "") {
      //TODO: remove hardcoded room and create it from code
      //console.log("JOINING ROOM")
      const roomNames = [username, activeUser.username].sort()
      const roomName = roomNames.join('-');
      console.log("ROOMNAME IN ACTIVEUSERLISTCLICK", roomName)
      //joinRoom(roomName);
    }
  }

  useEffect(() => {
      socket.on("receive_message", (data) => {
        console.log("RECEIVED MESSAGE", data)
        console.log("ACTIVE USER IS", activeUser)
        //handleChooseActiveConversation();
        setChosenChatDetails( { id: data.authorSocketId, name: data.author, avatarUrl: "" }, chatTypes.DIRECT );
      });
  });

  const handleListItemPressed = (e) => {
      if (e.target.value === 'VIDEO') {
        getLocalStream(activeUser);
      } else {
        getLocalAudioStream(activeUser);
      }
      handleChooseActiveConversation();
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