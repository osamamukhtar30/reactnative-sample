import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {debounce} from 'lodash';
import {
  selectAllFriends,
  selectFriendsSearch,
  selectFriendsSearchLoading,
} from '@duelme/apisdk/dist/slices/friends/selectors';
import {findFriends} from '@duelme/apisdk/dist/slices/friends/thunks';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';
import {selectSentRequests} from '@duelme/apisdk/dist/slices/friendships/selectors';
import {useTranslation} from 'react-i18next';
import {fetchFriendRequests} from '@duelme/apisdk/dist/slices/friendships/thunks';
import ReactNative from 'react-native';

import {SafeScrollView} from '../../../components/Container';
import LoadingGate from '../../../components/LoadingGate/LoadingGate';
import FriendList from '../components/friendList/FriendList';
import theme from '../../../global-styles/theme';

const TextInputContainer = styled.View`
  border-color: ${theme.colors.grey};
  flex-direction: row;
  border-bottom-width: 1px;
  margin-bottom: 10px;
  align-self: center;
  width: 80%;
  justify-content: center;
  align-items: center;
  padding: 5px;
  ${() =>
    ReactNative.Platform.OS === 'ios' &&
    `
    padding-bottom: 15px;
  `}
`;

const StyledTextInput = styled.TextInput`
  margin-horizontal: 20px;
  flex-grow: 1;
  font-size: 16px;
  color: ${theme.colors.white};
`;
const FindPlayer = () => {
  const [searchValue, setSearchValue] = useState('');
  const [t] = useTranslation('global');
  const dispatch = useDispatch();
  const users = useSelector(selectFriendsSearch);
  const friendRequests = useSelector(selectSentRequests);
  const requestedFriendIds = friendRequests.map(request => request.userIdTo);
  const loadingFriends = useSelector(selectFriendsSearchLoading);
  const friends = useSelector(selectAllFriends);
  const friendIds = friends.map(friend => friend.id);

  const debouncedFindFriends = useCallback(
    debounce(query => {
      dispatch(findFriends(query));
    }, 1000),
    [],
  );

  const handleFindFriend = text => {
    const query = text.toLowerCase();

    debouncedFindFriends(query);
    setSearchValue(text);
  };

  useEffect(() => {
    dispatch(fetchFriendRequests());
  }, []);

  return (
    <>
      <SafeScrollView testID={'find-player'} disableTopInset={true}>
        <TextInputContainer>
          <Icon name="magnifying-glass" type="regular" size={30} color={theme.colors.white}></Icon>
          <StyledTextInput
            testID="text-input"
            value={searchValue}
            onChangeText={text => {
              handleFindFriend(text);
            }}
            placeholderTextColor={theme.colors.transluscentWhite}
            placeholder={t('friends.findPlayer')}
          ></StyledTextInput>
        </TextInputContainer>
        <LoadingGate loading={loadingFriends}>
          {users.map(user => (
            <FriendList
              searchMode={true}
              requestSent={requestedFriendIds.includes(user.id)}
              isFriend={friendIds.includes(user.id)}
              key={user.id}
              friend={user}
            />
          ))}
        </LoadingGate>
      </SafeScrollView>
    </>
  );
};

export default FindPlayer;
