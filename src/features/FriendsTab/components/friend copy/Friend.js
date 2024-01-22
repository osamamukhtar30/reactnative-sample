import React from 'react';

import FriendContent from '../friendContent/ChatContent';

const Friend = ({
  friend,
  searchMode,
  newFriendMode,
  challengeFriend,
  sendFriendRequest,
  disabledAddFriend,
  requestMode,
  acceptFriendRequest,
  deleteFriendRequest,
}) => {
  if (searchMode) {
    return (
      <FriendContent
        friend={friend}
        newFriendMode={newFriendMode}
        challengeFriend={challengeFriend}
        sendFriendRequest={sendFriendRequest}
        disabledAddFriend={disabledAddFriend}
      />
    );
  }

  return (
    <FriendContent
      deleteFriendRequest={deleteFriendRequest}
      requestMode={requestMode}
      acceptFriendRequest={acceptFriendRequest}
      friend={friend}
      newFriendMode={newFriendMode}
      challengeFriend={challengeFriend}
      sendFriendRequest={sendFriendRequest}
    />
  );
};

export default Friend;
