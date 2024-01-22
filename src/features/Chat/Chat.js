import React, {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import ReactNative, {LayoutAnimation} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectFriendChatById} from '@duelme/apisdk/dist/slices/friendsChat/selectors';
import {selectActiveChat} from '@duelme/apisdk/dist/slices/activeChats/selectors';
import {markChatAsRead, fetchFriendsChatHistory} from '@duelme/apisdk/dist/slices/friendsChat/thunks';
import {sendFriendsChatMessage} from '@duelme/apisdk/dist/slices/friendsChat/native';
import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

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

const Chat = props => {
  const navigation = useNavigation();
  const {friend, challengeDisabled} = props.route.params;
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const activeChat = useSelector(selectActiveChat);
  const chatEntity = useSelector(state => selectFriendChatById(state, activeChat.entityId));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (chatEntity?.messages) {
      const messages = chatEntity.messages;
      dispatch(markChatAsRead(activeChat.entityId));
      const giftedChatMessages = messages.map((message, index) => {
        return {
          _id: index,
          text: message.message,
          createdAt: moment(message.timestamp),
          user: {
            _id: message.userId,
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
  }, [chatEntity]);

  useEffect(() => {
    if (activeChat.entityId) {
      dispatch(fetchFriendsChatHistory(activeChat.entityId));
    }
  }, [dispatch, activeChat.entityId]);
  const onSend = useCallback((messages = []) => {
    messages.forEach(messageToSend => {
      const body = {
        friendshipId: activeChat.entityId,
        accountName: messageToSend.user.name,
        profileImage: messageToSend.user.avatar,
        userId: messageToSend.user._id,
        message: messageToSend.text,
      };
      dispatch(sendFriendsChatMessage({friendshipId: activeChat.entityId, body}));
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
          challengeFriend={userId => {
            dispatch(openModal('quickChallenge', {userId, navigation}));
          }}
          challengeDisabled={challengeDisabled}
          friend={friend}
        />
        <ChatBody onSend={onSend} messages={messages} />
      </Container>
    </Background>
  );
};

export default Chat;
