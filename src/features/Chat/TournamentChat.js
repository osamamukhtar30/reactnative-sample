import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import ReactNative, {LayoutAnimation} from 'react-native';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {selectGameAccountByTournamentId} from '@duelme/apisdk/dist/slices/gameAccounts/selectors';
import {selectSocketConnected, selectSocketTopics} from '@duelme/apisdk/dist/slices/socket/selectors';
import {GiftedChat} from 'react-native-gifted-chat';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {selectTournamentById} from '@duelme/apisdk/dist/slices/tournaments/selectors';
import {selectTournamentChatById} from '@duelme/apisdk/dist/slices/tournamentChat/selectors';
import {fetchTournament} from '@duelme/apisdk/dist/slices/tournaments/thunks';
import {fetchTournamentChat} from '@duelme/apisdk/dist/slices/tournamentChat/thunks';
import {sendTournamentChatMessage} from '@duelme/apisdk/dist/slices/tournamentChat/web';

import theme from '../../global-styles/theme';
import {subscribeToTopic} from '../../app/middlewares/socket/actions';

import ChatHeader from './components/ChatHeader';
import ChatBody from './components/ChatBody';

const Container = styled.View`
  margin-top: ${({marginTop}) => marginTop}px;
  flex: 1;
  margin-bottom: ${hp(15)}px;
`;

const Background = styled(LinearGradient)`
  flex: 1;
`;

const TournamentChat = props => {
  const dispatch = useDispatch();

  const tournamentId = props.route.params.tournamentId;
  const opponentCaptain = props.route.params.opponentCaptain;

  const currentUser = useSelector(selectCurrentUser);
  const socketConnected = useSelector(selectSocketConnected);
  const socketTopics = useSelector(selectSocketTopics);
  const tournament = useSelector(state => selectTournamentById(state, tournamentId));
  const gameAccount = useSelector(state => selectGameAccountByTournamentId(state, tournamentId));
  const tournamentStatus = tournament.status;
  const [messages, setMessages] = useState([]);
  const insets = useSafeAreaInsets();
  const tournamentChat = useSelector(state => selectTournamentChatById(state, tournamentId));

  useEffect(() => {
    if (!gameAccount) {
      dispatch(fetchTournament(tournamentId));
    }
  }, [gameAccount, dispatch, tournamentId]);

  useEffect(() => {
    dispatch(fetchTournamentChat(tournamentId));
  }, [dispatch, tournamentId]);

  useEffect(() => {
    let topic = `/topic/tournament-chat/${tournamentId}`;
    if (socketConnected && !Object.keys(socketTopics).includes(topic)) {
      dispatch(subscribeToTopic(topic));
    }
  }, [dispatch, socketConnected, tournamentId, socketTopics]);

  useEffect(() => {
    if (tournamentChat?.messages) {
      const giftedChatMessages = tournamentChat.messages.map((message, index) => {
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
  }, [tournamentChat?.messages]);

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
      dispatch(sendTournamentChatMessage({tournamentId, body}));
    });

    if (ReactNative.Platform.OS === 'ios') {
      LayoutAnimation.easeInEaseOut();
    }

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, []);
  return (
    <Background colors={[theme.colors.trueBlue, theme.colors.darkPurple]} start={{x: 0, y: 0}} end={{x: 0.7, y: 0.7}}>
      <Container marginTop={insets.top}>
        <ChatHeader
          friend={currentUser}
          tournamentStatus={tournamentStatus}
          tournamentMode={true}
          tournamentName={tournament?.name}
          opponentCaptain={opponentCaptain}
        />
        <ChatBody tournamentStatus={tournamentStatus} onSend={onSend} messages={messages} />
      </Container>
    </Background>
  );
};

export default TournamentChat;
