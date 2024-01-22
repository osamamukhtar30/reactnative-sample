import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {sendMatchChatMessage} from '@duelme/apisdk/dist/slices/matchChat/native';
import ReactNative, {LayoutAnimation} from 'react-native';
import {selectMatchById} from '@duelme/apisdk/dist/slices/matches/selectors';
import {fetchMatch} from '@duelme/apisdk/dist/slices/matches/thunks';
import {fetchMatchChatHistory} from '@duelme/apisdk/dist/slices/matchChat/thunks';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {selectMatchChat} from '@duelme/apisdk/dist/slices/matchChat/selectors';
import {selectGameAccountByMatchId} from '@duelme/apisdk/dist/slices/gameAccounts/selectors';
import {selectSocketConnected, selectSocketTopics} from '@duelme/apisdk/dist/slices/socket/selectors';
import {GiftedChat} from 'react-native-gifted-chat';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import {subscribeToTopic} from '../../app/middlewares/socket/actions';
import theme from '../../global-styles/theme';

import ChatBody from './components/ChatBody';
import ChatHeader from './components/ChatHeader';

const Container = styled.View`
  margin-top: ${({marginTop}) => marginTop}px;
  flex: 1;
  margin-bottom: ${hp(15)}px;
`;

const Background = styled(LinearGradient)`
  flex: 1;
`;

const MatchChat = props => {
  const dispatch = useDispatch();

  const matchId = props.route.params.matchId;
  const opponentCaptain = props.route.params.opponentCaptain;

  const currentUser = useSelector(selectCurrentUser);
  const gameAccount = useSelector(state => selectGameAccountByMatchId(state, matchId));
  const socketConnected = useSelector(selectSocketConnected);
  const socketTopics = useSelector(selectSocketTopics);
  const match = useSelector(state => selectMatchById(state, matchId));
  const matchStatus = match.status;
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();
  const matchChat = useSelector(state => selectMatchChat(state, matchId));

  useEffect(() => {
    if (!gameAccount) {
      dispatch(fetchMatch(matchId));
    }
  }, [gameAccount, dispatch, matchId]);

  useEffect(() => {
    dispatch(fetchMatchChatHistory(matchId));
  }, [dispatch, matchId]);

  useEffect(() => {
    let topic = `/topic/match-chat/${matchId}`;
    if (socketConnected && !Object.keys(socketTopics).includes(topic)) {
      dispatch(subscribeToTopic(topic));
    }
  }, [dispatch, socketConnected, matchId, socketTopics]);

  useEffect(() => {
    if (matchChat.messages) {
      const giftedChatMessages = matchChat.messages.map((message, index) => {
        return {
          _id: index,
          text: message.message,
          createdAt: moment(message.timestamp),
          user: {
            _id: message.userId ?? message.entityId,
            name: message.accountName,
            avatar: message.profileImage,
          },
        };
      });
      giftedChatMessages.sort((a, b) => b.createdAt - a.createdAt);
      if (ReactNative.Platform.OS === 'ios') {
        LayoutAnimation.easeInEaseOut();
      }
      setMessages(giftedChatMessages);
    }
  }, [matchChat.messages]);

  const onSend = useCallback((messages = []) => {
    messages.forEach(messageToSend => {
      const body = {
        profileImage: messageToSend.user.avatar,
        gameAccountId: gameAccount.id,
        userId: messageToSend.user._id,
        message: messageToSend.text,
      };

      const {accountName} = gameAccount;
      body.accountName = accountName;
      dispatch(sendMatchChatMessage({matchId, body}));
    });

    if (ReactNative.Platform.OS === 'ios') {
      LayoutAnimation.easeInEaseOut();
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, []);
  return (
    <Background colors={[theme.colors.trueBlue, theme.colors.darkPurple]} start={{x: 0, y: 0}} end={{x: 0.7, y: 0.7}}>
      <Container marginTop={insets.top}>
        <ChatHeader friend={currentUser} matchStatus={matchStatus} matchMode={true} opponentCaptain={opponentCaptain} />
        <ChatBody matchStatus={matchStatus} onSend={onSend} messages={messages} />
      </Container>
    </Background>
  );
};

export default MatchChat;
