import React, { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import './Chat.css';
import userAvatar from '../../../resources/userAvatar.png';
import { sendMessage, socket } from '../../../utils/wssConnection/wssConnection';
import { chatTypes, getActions } from "../../../store/actions/chatActions";
import ScrollToBottom from 'react-scroll-to-bottom';


const Chat = (props) => {
    const [currentMessage, setCurrentMessage] = useState('');

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
          console.log("DATA FOR AUTHOR IS: ", data)
          console.log("NAME IS: ", name)
          console.log("USERNAME IS: ", username)
          console.log("LENGT IS: ", messageList.length)
            const txt = {
                sender: data.author,
                text: data.message
            }
          if (messageList.length === 0) {
            console.log("inside first message")
          }
          else if (name === data.author)
          {
            console.log("INSIDE receive_message", data);
            setMessageList((list) => [...list, txt]);
          } else {
            setMessageList([]);
            setMessageList((list) => [...list, txt]);
            newName = data.author;
            setChosenChatDetails( { id: data.authorSocketId, name: data.author, avatarUrl: data.avatarUrl }, chatTypes.DIRECT );
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
            const messageData = {
                room : roomName,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                socketId: id,
                authorSocketId: socket.id,
                avatarUrl: chosenChatDetails.avatarUrl
            };
            console.log("MESSAGE DATA IS:", messageData)
            //simple object needed so far
            const messageData2 = {
                sender: username,
                text: currentMessage,
            };
            await socket.emit("send_message", messageData);
            //setMessageList((list) => [...list, messageData2]);
            setMessageList((list) => {
                const updatedList = [...list, messageData2];
                console.log('ABOUT TO SET LOCALSTORAGE WITH', updatedList)
                localStorage.setItem(`messageList_${roomName}`, JSON.stringify(updatedList)); // Set localStorage after updating messageList
                return updatedList;
            });

            setCurrentMessage("");
            //localStorage.setItem(`messageList_${roomName}`, JSON.stringify(messageList));
        }
    }

    const renderMessages = () => {
      console.log("INSIDE REDENR MESSAGES MESSAGELIST", messageList)
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
                    <img className='chat_user_avatar' src={avatarUrl || userAvatar} alt={name} /><div className='chat_user_name'>{newName? newName: name}</div>
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
    //console.log("STATE", state)
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