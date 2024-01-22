import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {selectGameById} from '@duelme/apisdk/dist/slices/games/selectors';
import {GAME_NAMES} from '@duelme/js-constants/dist/games';
import {PUBLIC_USER_STATUS_TEXT, PUBLIC_USER_STATUS_OFFLINE} from '@duelme/js-constants/dist/friends';
import Icon from 'react-native-fontawesome-pro';
import {setActiveChat} from '@duelme/apisdk/dist/slices/activeChats/native';
import {useTranslation} from 'react-i18next';
import {BubblesLoader} from 'react-native-indicator';
import {Platform} from 'react-native';
import {MATCH_STATUS_DISPUTED} from '@duelme/js-constants/dist/matches';
import {selectCurrentTournament} from '@duelme/apisdk/dist/slices/tournaments/selectors';
import {selectShowPendingChatIcon} from '@duelme/apisdk/dist/slices/friendsChat/selectors';
import {selectHasUnreadMessagesById} from '@duelme/apisdk/dist/slices/matchChat/selectors';

import AvatarProfile from '../../../../components/AvatarProfile';
import theme from '../../../../global-styles/theme';
import useChallengeUserDisabled from '../../../../utils/useChallengeUserDisabled';

import {
  ActionsContainer,
  ActionContainer,
  AvatarProfileContainer,
  FriendContainer,
  FriendRowContainer,
  NickNameText,
  StatusContainer,
  StatusText,
  UserDataContainer,
  MatchProfileContainer,
  TournamentStatusText,
  UnreadBubble,
} from './ChatContent.styles';

const ChatContent = ({
  friend,
  child,
  newFriendMode,
  sendFriendRequest,
  challengeFriend,
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
  const navigation = useNavigation();

  const isOnline = friend?.status !== PUBLIC_USER_STATUS_OFFLINE;
  const game = useSelector(state => selectGameById(state, friend?.gameId));
  const dispatch = useDispatch();
  const [t] = useTranslation('global');
  const [sendingFriendRequest, setSendingFriendRequest] = useState(false);
  const [acceptingFriendRequest, setAcceptingFriendRequest] = useState(false);
  const [rejectingFriendRequest, setRejectingFriendRequest] = useState(false);
  const challengeDisabled = !matchMode && !tournamentMode ? useChallengeUserDisabled({user: friend}) : true;
  const currentTournament = useSelector(selectCurrentTournament);
  const statusText = PUBLIC_USER_STATUS_TEXT[friend?.status]?.replace('GAME', GAME_NAMES[game?.name]);
  const unread = friend ? useSelector(state => selectShowPendingChatIcon(state, friend?.friendshipId)) : false;
  const hasPendingMatchChat = matchId ? useSelector(state => selectHasUnreadMessagesById(state, matchId)) : false;

  return (
    <FriendContainer testID="friend-item">
      <FriendRowContainer isGreen={currentTournament?.id === tournamentId} matchStatus={matchStatus}>
        {tournamentMode ? (
          <>
            <UserDataContainer>
              <NickNameText>{tournamentName}</NickNameText>

              {tournamentStatus && (
                <StatusContainer contentContainerStyle={{alignItems: 'center'}} horizontal={true}>
                  <TournamentStatusText
                    isGreen={currentTournament?.id === tournamentId}
                    tournamentStatus={tournamentStatus}
                    isOnline={false}
                  >
                    {currentTournament?.id === tournamentId
                      ? t('chat.currentTournament')
                      : t(`tournamentStatuses.${tournamentStatus}`)}
                  </TournamentStatusText>
                </StatusContainer>
              )}
            </UserDataContainer>

            <ActionsContainer>
              <ActionContainer
                onPress={async () => {
                  await dispatch(setActiveChat({type: 'match', entityId: matchId}));
                  navigation.navigate('TournamentChat', {tournamentId: tournamentId});
                }}
              >
                <Icon color={theme.colors.white} name="comment-dots" type="solid" size={wp('5.5%')} />
              </ActionContainer>
            </ActionsContainer>
          </>
        ) : matchMode ? (
          <>
            <MatchProfileContainer>
              <AvatarProfileContainer>
                <AvatarProfile
                  isPro={currentUser.proMembership}
                  imageSize={wp(10)}
                  source={{uri: currentUser.profileImage}}
                  displayStatus={false}
                />
              </AvatarProfileContainer>
              <AvatarProfileContainer>
                <AvatarProfile
                  isPro={opponentCaptain.proMembership}
                  imageSize={wp(10)}
                  source={{uri: opponentCaptain?.profileImage}}
                  displayStatus={false}
                />
              </AvatarProfileContainer>
            </MatchProfileContainer>
            <UserDataContainer>
              <NickNameText>{t('chat.matchChat')}</NickNameText>

              {matchStatus && (
                <StatusContainer contentContainerStyle={{alignItems: 'center'}} horizontal={true}>
                  <StatusText matchStatus={matchStatus} isOnline={false}>
                    {matchStatus === MATCH_STATUS_DISPUTED ? t('chat.matchDisputed') : t('chat.currentMatch')}
                  </StatusText>
                </StatusContainer>
              )}
            </UserDataContainer>

            <ActionsContainer>
              <ActionContainer
                onPress={async () => {
                  await dispatch(setActiveChat({type: 'match', entityId: matchId}));
                  navigation.navigate('MatchChat', {matchId: matchId, opponentCaptain});
                }}
              >
                <Icon color={theme.colors.white} name="comment-dots" type="solid" size={wp('5.5%')} />
                {hasPendingMatchChat && <UnreadBubble />}
              </ActionContainer>
            </ActionsContainer>
          </>
        ) : (
          <>
            <AvatarProfileContainer>
              <AvatarProfile
                isPro={friend.proMembership}
                imageSize={wp(10)}
                source={{uri: requestMode ? friend.profileImageFrom : friend.profileImage}}
                displayStatus={!(newFriendMode || requestMode)}
                online={isOnline}
              />
            </AvatarProfileContainer>
            <UserDataContainer>
              <NickNameText>{requestMode ? friend.usernameFrom : friend.username}</NickNameText>
              {!(newFriendMode || requestMode) && (
                <StatusContainer contentContainerStyle={{alignItems: 'center'}} horizontal={true}>
                  <StatusText isOnline={isOnline}>{statusText}</StatusText>
                </StatusContainer>
              )}
            </UserDataContainer>

            <ActionsContainer>
              {requestMode ? (
                <>
                  <ActionContainer
                    testID="accept-button"
                    onPress={async () => {
                      setAcceptingFriendRequest(true);
                      await acceptFriendRequest();
                      setAcceptingFriendRequest(false);
                    }}
                  >
                    {acceptingFriendRequest ? (
                      <BubblesLoader
                        dotRadius={Platform.isPad ? wp('5.8%') * 0.15 : wp('6.8%') * 0.15}
                        color={theme.colors.white}
                        size={Platform.isPad ? wp('3.8%') : wp('6.8%')}
                      />
                    ) : (
                      <Icon name={'check'} type="solid" size={wp('5.5%')} color={theme.colors.white} />
                    )}
                  </ActionContainer>
                  <ActionContainer
                    testID="reject-button"
                    onPress={async () => {
                      setRejectingFriendRequest(true);
                      const resp = await deleteFriendRequest();
                      if (resp?.error) {
                        setRejectingFriendRequest(false);
                      }
                    }}
                  >
                    {rejectingFriendRequest ? (
                      <BubblesLoader
                        testID="loading"
                        dotRadius={Platform.isPad ? wp('5.8%') * 0.15 : wp('6.8%') * 0.15}
                        color={theme.colors.white}
                        size={Platform.isPad ? wp('3.8%') : wp('6.8%')}
                      />
                    ) : (
                      <Icon name={'xmark'} type="solid" size={wp('5.5%')} color={theme.colors.white} />
                    )}
                  </ActionContainer>
                </>
              ) : newFriendMode ? (
                <ActionContainer
                  testID="send-request-button"
                  onPress={async () => {
                    setSendingFriendRequest(true);
                    await sendFriendRequest();
                    setSendingFriendRequest(false);
                  }}
                  disabled={disabledAddFriend || isFriend}
                >
                  {sendingFriendRequest ? (
                    <BubblesLoader
                      dotRadius={Platform.isPad ? wp('5.8%') * 0.15 : wp('6.8%') * 0.15}
                      color={theme.colors.white}
                      size={Platform.isPad ? wp('3.8%') : wp('6.8%')}
                    />
                  ) : (
                    <Icon
                      name={
                        !disabledAddFriend && !isFriend
                          ? 'user-plus'
                          : isFriend
                          ? 'user-check'
                          : 'envelope-circle-check'
                      }
                      type="solid"
                      size={wp('8%')}
                      color={disabledAddFriend ? theme.colors.grey : theme.colors.white}
                    />
                  )}
                </ActionContainer>
              ) : (
                <>
                  <ActionContainer
                    onPress={async () => {
                      await dispatch(setActiveChat({type: 'friend', entityId: friend.friendshipId}));
                      navigation.navigate('Chat', {friend, challengeDisabled});
                    }}
                  >
                    <Icon color={theme.colors.white} name="comment-dots" type="solid" size={wp('5.5%')} />
                    {unread && <UnreadBubble />}
                  </ActionContainer>
                  <ActionContainer onPress={() => challengeFriend(friend.id)} disabled={challengeDisabled}>
                    <IconMaterialCommunityIcons
                      name="sword-cross"
                      size={wp('5.5%')}
                      color={challengeDisabled ? theme.colors.grey : theme.colors.white}
                    />
                  </ActionContainer>
                </>
              )}
            </ActionsContainer>
          </>
        )}
      </FriendRowContainer>
      {child && child}
    </FriendContainer>
  );
};

export default ChatContent;
