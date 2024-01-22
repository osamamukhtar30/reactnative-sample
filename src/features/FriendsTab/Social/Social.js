import React, {useEffect} from 'react';
import {RefreshControl} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllSortedFriends} from '@duelme/apisdk/dist/slices/friends/selectors';
import {selectCurrentMatchChat, selectOtherMatchChats} from '@duelme/apisdk/dist/slices/matchChat/selectors';
import {fetchMatchChatHistory, fetchPendingMatchChat} from '@duelme/apisdk/dist/slices/matchChat/thunks';
import {fetchFriends, findFriends} from '@duelme/apisdk/dist/slices/friends/thunks';
import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {heightPercentageToDP, widthPercentageToDP} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {selectCurrentMatchId} from '@duelme/apisdk/dist/slices/matches/selectors';
import {selectCurrentTournament, selectUpcomingTournaments} from '@duelme/apisdk/dist/slices/tournaments/selectors';
import {fetchCurrentUser} from '@duelme/apisdk/dist/slices/account/thunks';

import {SafeScrollView} from '../../../components/Container';
import FriendList from '../components/friendList/FriendList';
import LoadingGate from '../../../components/LoadingGate/LoadingGate';
import theme from '../../../global-styles/theme';
import ActiveMatch from '../components/activeMatch/ActiveMatch';
import TournamentChat from '../components/tournamentChat/TournamentChat';

import SocialEmptyState from './SocialEmptyState';

const HeaderText = styled.Text`
  color: ${theme.colors.white};
  font-size: ${widthPercentageToDP(5)}px;
  margin-left: ${widthPercentageToDP(4)}px;
  margin-vertical: ${heightPercentageToDP(2)}px;
  font-family: Quantico-Bold;
  text-transform: uppercase;
`;
const Container = styled.View`
  flex: 1;
`;

const Social = () => {
  const dispatch = useDispatch();
  const friends = useSelector(selectAllSortedFriends);
  const loadingFriends = useSelector(state => state.friends.isLoading);
  const currentMatchId = useSelector(selectCurrentMatchId);
  const otherMatchChats = useSelector(selectOtherMatchChats);
  const currentMatchChat = useSelector(selectCurrentMatchChat);
  const incomingTournaments = useSelector(selectUpcomingTournaments);
  const currentTournament = useSelector(selectCurrentTournament);
  const tournamentChatEntities = incomingTournaments.filter(tr => tr.id !== currentTournament?.id);

  const navigation = useNavigation();
  const [t] = useTranslation('global');

  const loadFriends = async (searchMode, keyword) => {
    if (searchMode) {
      dispatch(findFriends(keyword));
    }
    dispatch(fetchPendingMatchChat());
    dispatch(fetchFriends());
  };

  useEffect(() => {
    loadFriends();
  }, []);

  useEffect(() => {
    if (currentMatchId) {
      dispatch(fetchMatchChatHistory(currentMatchId));
    }
  }, [currentMatchId]);

  return (
    <Container testID={'social'}>
      <LoadingGate loading={loadingFriends}>
        <SafeScrollView
          disableTopInset={true}
          refreshControl={
            <RefreshControl
              tintColor={theme.colors.white}
              refreshing={loadingFriends}
              onRefresh={() => {
                dispatch(fetchCurrentUser());
                dispatch(fetchFriends());
              }}
            />
          }
        >
          {(otherMatchChats.length > 0 || currentMatchChat) && (
            <>
              <HeaderText>{t('chat.matchChats')}</HeaderText>
              {currentMatchChat && <ActiveMatch key={currentMatchChat.id} matchId={currentMatchChat.id}></ActiveMatch>}
              {otherMatchChats.map(chat => (
                <ActiveMatch key={chat.id} matchId={chat.id}></ActiveMatch>
              ))}
            </>
          )}
          {(incomingTournaments.length > 0 || currentTournament) && (
            <>
              <HeaderText>{t('chat.tournamentChat')}</HeaderText>
              {currentTournament && (
                <TournamentChat key={currentTournament.id} tournamentId={currentTournament.id}></TournamentChat>
              )}
              {tournamentChatEntities.map(tournament => (
                <TournamentChat key={tournament.id} tournamentId={tournament.id}></TournamentChat>
              ))}
            </>
          )}
          {friends.length > 0 && (
            <>
              <HeaderText testID="friends-list">{t('friends_')}</HeaderText>
              {friends.map(friend => (
                <FriendList
                  key={friend.id}
                  challengeFriend={userId => {
                    dispatch(openModal('quickChallenge', {userId, navigation}));
                  }}
                  friend={friend}
                />
              ))}
            </>
          )}

          {friends.length === 0 &&
            otherMatchChats.length === 0 &&
            tournamentChatEntities.length === 0 &&
            !currentMatchChat &&
            !currentTournament && <SocialEmptyState />}
        </SafeScrollView>
      </LoadingGate>
    </Container>
  );
};

export default Social;
