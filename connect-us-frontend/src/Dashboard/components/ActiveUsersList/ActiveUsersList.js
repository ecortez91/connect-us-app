import React from 'react';
import ActiveUsersListItem from './ActiveUsersListItem';

import './ActiveUsersList.css';

const activeUsers = [
  {
    socketId: 321,
    username: 'Ed'
  },
  {
    socketId: 333,
    username: 'Mike'
  },
  {
    socketId: 432,
    username: 'Cortez'
  },
  {
    socketId: 345,
    username: 'Rodriguez'
  }
];

const ActiveUsersList = () => {
  return (
    <div className='active_user_list_container'>
      {activeUsers.map((activeUser) =>
        <ActiveUsersListItem
          key={activeUser.socketId}
          activeUser={activeUser}
        />)}
    </div>
  );
};

export default ActiveUsersList;
