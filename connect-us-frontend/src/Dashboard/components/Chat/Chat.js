import React, { useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import './Chat.css';
import userAvatar from '../../../resources/userAvatar.png';
import { sendMessage, socket } from '../../../utils/wssConnection/wssConnection';
import { chatTypes, getActions } from "../../../store/actions/chatActions";
import ScrollToBottom from 'react-scroll-to-bottom';


const Chat = (props) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const activeUsers = useSelector(state => state.dashboard.activeUsers);
    const { 
        id,
        name,
        avatarUrl,
        username,
        chosenChatDetails,
        setChosenChatDetails,
        messageList,
        setMessageList
    } = props;

    let newName = '';
    useEffect(() => {
        socket.on("receive_message", (data) => {
          const txt = {
              sender: data.author,
              text: data.message
          }
          const cleanAuthor =  data.author.replace(' (Busy)', "")
          const avatarUserSelected = activeUsers.find(user => user.username.replace(' (Busy)', "") === cleanAuthor);
          if (messageList.length === 0) {
            setChosenChatDetails( { id: data.authorSocketId, name: data.author, avatarUrl: avatarUserSelected?.avatarUrl ? avatarUserSelected.avatarUrl : ""}, chatTypes.DIRECT );
          }
          else if (name === data.author) {
            setMessageList((list) => [...list, txt]);
          } else {
            setChosenChatDetails( { id: data.authorSocketId, name: data.author, avatarUrl: avatarUserSelected?.avatarUrl ? avatarUserSelected.avatarUrl : ""}, chatTypes.DIRECT );
            setMessageList([]);
            newName = data.author;
          }
        });
        return () => socket.removeListener('receive_message')
    });

    useEffect(() => {
      if (name) {
        const roomNames = [username, name].sort();
        const roomName = roomNames.join('-');
        const storedMessageList = localStorage.getItem(`messageList_${roomName}`);
        if (storedMessageList) {
          setMessageList((prevMessageList) => {
            return [...prevMessageList, ...JSON.parse(storedMessageList)];
          });
        }
      }
    }, [name, setMessageList]);

    const sendMessageOnClick = async () => {
        if (currentMessage !== "" ) {
            //object with more data
            const roomNames = [username, name].sort();
            const roomName = roomNames.join('-');
            const fullMessageData = {
                room : roomName,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                socketId: id,
                authorSocketId: socket.id
            };
            console.log("MESSAGE DATA IS:", fullMessageData)
            //simple object needed so far
            const messageData = {
                sender: username,
                text: currentMessage,
            };
            await socket.emit("send_message", fullMessageData);
            setMessageList((list) => {
                const updatedList = [...list, messageData];
                localStorage.setItem(`messageList_${roomName}`, JSON.stringify(updatedList)); // Set localStorage after updating messageList
                return updatedList;
            });

            setCurrentMessage("");
            //localStorage.setItem(`messageList_${roomName}`, JSON.stringify(messageList));
        }
    }

    const renderMessages = () => {
        return messageList.map((message, index) => (
          <div key={index} className={message.sender === name ? 'received' : 'sent'}>
            {message.text}
          </div>
        ));
    };

   return  props.chosenChatDetails ?
    (
        <>
            <div className="chat-popup">
              <div className="chat-header background_secondary_color">
               <div className='chat_user_avatar_container'>
                    <img className='chat_user_avatar' src={chosenChatDetails.avatarUrl || userAvatar} alt={name} /><div className='chat_user_name'>{newName? newName: name}</div>
               </div>
               { /** <div className="chat-popup-close"><button style={{  }}>X</button> </div> */ }
              </div>
                <ScrollToBottom className='chat-messages'>
                {
                    renderMessages()
                }
                </ScrollToBottom>
              <div className="chat-input">
                <input
                  type="text"
                  value={currentMessage}
                  placeholder="Type a message..."
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessageOnClick();
                  }}
                />
                <button onClick={sendMessageOnClick}>Send</button>
              </div>
            </div>
        </>
    ) : ""
};

function mapStoreStateToProps (state) {
    return {
        name: state.chat.chosenChatDetails?.name,
        id: state.chat.chosenChatDetails?.id,
        avatarUrl: state.chat.chosenChatDetails?.avatarUrl,
        chosenChatDetails: state.chat.chosenChatDetails,
        username: state.dashboard.username,
        ...state.chat,
    };
}

const mapActionsToProps = (dispatch) => {
  return {
    ...getActions(dispatch),
  };
};
export default connect(mapStoreStateToProps, mapActionsToProps)(Chat);