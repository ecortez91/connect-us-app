import React from 'react';
import ActiveUsersListItem from './ActiveUsersListItem';
import { connect } from 'react-redux';
import './ActiveUsersList.css';

const ActiveUsersList = ( { activeUsers, callState, username } ) => {
  return (
    <div className='active_user_list_container'>
      {activeUsers.map((activeUser) =>
        <ActiveUsersListItem
          key={activeUser.socketId}
          activeUser={activeUser}
          callState={callState}
          username={username}
        />)}
    </div>
  );
};

const mapStateToProps = ({ dashboard, call }) => ({
  ...dashboard,
  ...call,
  callState: call.callState,
});

export default connect(mapStateToProps)(ActiveUsersList);
