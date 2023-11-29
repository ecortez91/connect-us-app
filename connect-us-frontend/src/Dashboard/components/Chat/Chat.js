import React from 'react';
import { connect } from 'react-redux';
import './Chat.css';
import userAvatar from '../../../resources/userAvatar.png'

const Chat = (props) => {
    const { 
        id,
        name,
        avatarUrl
    } = props;

    const renderMessages = () => {
    };

    return (
        <>
            <div className="chat-popup">
              <div className="chat-header background_secondary_color">
               <div className='chat_user_avatar_container'>
                    <img className='chat_user_avatar' src={avatarUrl || userAvatar} alt={name} /><div className='chat_user_name'>{name}</div>
               </div>
               <div className="chat-popup-close"><button style={{  }}>X</button> </div>
              </div>
              <div className="chat-messages">
                {
                    //renderMessages()
                }
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type a message..." />
                <button >Send</button>
              </div>
            </div>
        </>
    );
};

function mapStoreStateToProps (state) {
    return {
        name: state.chat.chosenChatDetails?.name,
        id: state.chat.chosenChatDetails?.id,
        avatarUrl: state.chat.chosenChatDetails?.avatarUrl
    };
}

export default connect(mapStoreStateToProps)(Chat);