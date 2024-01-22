import React, {useEffect} from 'react';
import {RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import {useNavigation} from '@react-navigation/native';
import {selectReceivedRequests} from '@duelme/apisdk/dist/slices/friendships/selectors';
import {fetchFriendRequests} from '@duelme/apisdk/dist/slices/friendships/thunks';

import {SafeScrollView} from '../../../components/Container';
import FriendList from '../components/friendList/FriendList';
import LoadingGate from '../../../components/LoadingGate/LoadingGate';
import theme from '../../../global-styles/theme';

import RequestsEmptyState from './RequestsEmptyState';

const Requests = () => {
  const dispatch = useDispatch();
  const friendRequests = useSelector(selectReceivedRequests);
  const loadingFriends = useSelector(state => state.friends.isLoading);
  const navigation = useNavigation();

  useEffect(async () => {
    await dispatch(fetchFriendRequests());
  }, []);

  return (
    <>
      <LoadingGate loading={loadingFriends}>
        <SafeScrollView
          testID={'requests'}
          disableTopInset={true}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.white}
              refreshing={loadingFriends}
              onRefresh={() => dispatch(fetchFriendRequests())}
            />
          }
        >
          {friendRequests.map(friend => (
            <FriendList
              requestMode
              key={friend.id}
              challengeFriend={async userId => {
                await dispatch(
                  openModal('quickChallenge', {
                    userId,
                    navigation,
                  }),
                );
              }}
              friend={friend}
            />
          ))}
          {friendRequests.length === 0 && <RequestsEmptyState />}
        </SafeScrollView>
      </LoadingGate>
    </>
  );
};

export default Requests;
