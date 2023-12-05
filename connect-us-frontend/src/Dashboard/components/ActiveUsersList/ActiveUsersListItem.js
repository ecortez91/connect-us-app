import React from 'react';
import userAvatar from '../../../resources/userAvatar.png';
import { getLocalAudioStream, getLocalStream } from '../../../utils/webRTC/webRTCHandler';
import ConversationButton from '../ConversationButtons/ConversationButton';
import { chatTypes, getActions } from "../../../store/actions/chatActions";
import { connect, useSelector } from "react-redux";
import { joinRoom, socket } from '../../../utils/wssConnection/wssConnection';
import { useEffect } from 'react';

const ActiveUsersListItem = (props) => {
  const { activeUser, setChosenChatDetails, username, messageList, setMessageList } = props;
  const activeUsers = useSelector(state => state.dashboard.activeUsers);

  const handleChooseActiveConversation = () => {
    let cleanUsername = activeUser.username.replace(" (Busy)", "");
    setChosenChatDetails( { id: activeUser.socketId, name: cleanUsername, avatarUrl: activeUser.avatarUrl }, chatTypes.DIRECT );
    if (username !== "") {
      setMessageList([]);
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
        const userSelected = activeUsers.find(user => user.username === data.author);
        setChosenChatDetails( { id: data.authorSocketId, name: data.author, avatarUrl: userSelected?.avatarUrl || "" }, chatTypes.DIRECT );
      });
      return () => socket.removeListener('receive_message')
  }, []);

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