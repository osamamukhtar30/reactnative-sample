import React from 'react';
import {
  acceptFriendRequest,
  rejectFriendRequest,
  sendFriendRequest,
} from '@duelme/apisdk/dist/slices/friendships/thunks';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {removeRequest} from '@duelme/apisdk/dist/slices/friendships/native';

import useSyncEndpointCall from '../../../../utils/syncEndpointCall';
import Friend from '../friend/ChatItem';

const FriendList = ({friend, searchMode, challengeFriend, requestSent, requestMode, isFriend}) => {
  const syncEndpointCall = useSyncEndpointCall();
  const dispatch = useDispatch();
  const [t] = useTranslation('global');

  return (
    <Friend
      requestMode={requestMode}
      searchMode={searchMode}
      friend={friend}
      newFriendMode={searchMode}
      challengeFriend={challengeFriend}
      disabledAddFriend={requestSent}
      isFriend={isFriend}
      sendFriendRequest={async () => {
        await syncEndpointCall({
          avoidOpenLoading: true,
          reduxAction: sendFriendRequest(friend.id),
          errorText: t('friend_request_not_sent'),
          successText: t('friend_request_sent'),
        });
      }}
      acceptFriendRequest={async () => {
        await syncEndpointCall({
          loadingText: t('accepting_friend_request'),
          reduxAction: acceptFriendRequest(friend.id),
          errorText: t('friend_request_not_accepted'),
          successText: t('friend_request_accepted'),
          successCallback: () => {
            dispatch(removeRequest(friend.id));
          },
        });
      }}
      deleteFriendRequest={async () => {
        await syncEndpointCall({
          loadingText: t('deleting_friend_request'),
          reduxAction: rejectFriendRequest(friend.id),
          errorText: t('friend_request_not_deleted'),
          successText: t('friend_request_deleted'),
          successCallback: () => {
            dispatch(removeRequest(friend.id));
          },
        });
      }}
    />
  );
};

export default FriendList;
