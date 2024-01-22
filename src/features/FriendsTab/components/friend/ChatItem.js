import React from 'react';

import ChatContent from '../chatContent/ChatContent';

const ChatItem = ({
  friend,
  searchMode,
  newFriendMode,
  challengeFriend,
  sendFriendRequest,
  disabledAddFriend,
  requestMode,
  acceptFriendRequest,
  deleteFriendRequest,
  matchMode,
  opponentCaptain,
  matchStatus,
  currentUser,
  matchId,
  isFriend,
  tournamentMode,
  tournamentStatus,
  tournamentId,
  tournamentName,
}) => {
  if (searchMode) {
    return (
      <ChatContent
        friend={friend}
        newFriendMode={newFriendMode}
        challengeFriend={challengeFriend}
        sendFriendRequest={sendFriendRequest}
        disabledAddFriend={disabledAddFriend}
        isFriend={isFriend}
      />
    );
  }
  if (matchMode) {
    return (
      <ChatContent
        matchMode={true}
        opponentCaptain={opponentCaptain}
        matchStatus={matchStatus}
        currentUser={currentUser}
        matchId={matchId}
      />
    );
  }
  if (tournamentMode) {
    return (
      <ChatContent
        tournamentMode={true}
        tournamentStatus={tournamentStatus}
        currentUser={currentUser}
        tournamentId={tournamentId}
        tournamentName={tournamentName}
      />
    );
  }
  return (
    <ChatContent
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

export default ChatItem;
