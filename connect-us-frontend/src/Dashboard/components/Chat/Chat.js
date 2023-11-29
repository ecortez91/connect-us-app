import React from 'react';
import { connect } from 'react-redux';
import './Chat.css'; // Import your CSS file for styling
import userAvatar from '../../../resources/userAvatar.png'

const Chat = (props) => {
    const { 
        name
    } = props;

    return (
        <>
            <div className="chat-popup">
              <div className="chat-header background_secondary_color">
               <div className='chat_user_avatar_container'>
                    <img className='chat_user_avatar' src={userAvatar} alt={name} /><div className='chat_user_name'>{name}</div>
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
        name: state.chat.chosenChatDetails?.name
    };
}

export default connect(mapStoreStateToProps)(Chat);