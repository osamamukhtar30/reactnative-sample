import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {MATCH_STATUS_DISPUTED} from '@duelme/js-constants/dist/matches';
import React from 'react';
import ReactNative from 'react-native';
import {GiftedChat, Bubble, Composer} from 'react-native-gifted-chat';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-fontawesome-pro';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {TOURNAMENT_STATUS_CLOSED_SIGNUP, TOURNAMENT_STATUS_OPEN_SIGNUP} from '@duelme/js-constants/dist/tournaments';

import theme from '../../../global-styles/theme';

const TextInputContainer = styled.View`
  min-height: ${({heightProp}) => heightProp}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: ${wp(2)}px;
  padding-right: ${wp(2)}px;
  border: 1px solid ${({theme}) => theme.colors.grey};
  margin-left: ${wp(2)}px;
  margin-right: ${wp(2)}px;
  width: ${wp(80)}px;
  border-radius: 30px;
`;

const SendContainer = styled.TouchableOpacity`
  display: flex;
  background-color: ${({theme}) => theme.colors.paradisePink};
  border-radius: 360px;
  height: ${wp(12)}px;
  width: ${wp(12)}px;
  max-height: ${hp(5)}px;
  max-width: ${hp(5)}px;
  justify-content: center;
  align-items: center;
`;

const OutContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
`;

const renderBubble = props => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {backgroundColor: theme.colors.white},
        right: {backgroundColor: '#452ce3'},
      }}
      textStyle={{
        left: {color: theme.colors.primaryDarkest, fontSize: 14},
        right: {color: theme.colors.white, fontSize: 14},
      }}
    />
  );
};

const renderInputToolbar = props => {
  const {text, onSend, minInputToolbarHeight} = props;
  return (
    <OutContainer>
      <TextInputContainer heightProp={minInputToolbarHeight}>
        <Composer {...props} textInputStyle={{color: theme.colors.white}} />
      </TextInputContainer>
      <SendContainer
        heightProp={minInputToolbarHeight}
        onPress={() => {
          if (text && onSend) {
            onSend({text: text.trim()}, true);
          }
        }}
      >
        <Icon name={'paper-plane-top'} color={theme.colors.white} type="solid" size={hp(2)} />
      </SendContainer>
    </OutContainer>
  );
};

const ChatBody = props => {
  const {username, profileImage, id: userId, matchStatus, tournamentStatus} = useSelector(selectCurrentUser);

  return (
    <GiftedChat
      alwaysShowSend={true}
      scrollToBottom
      bottomOffset={ReactNative.Platform.OS === 'android' ? -hp(1) : hp(10) * 1.2 + hp(2)}
      renderInputToolbar={renderInputToolbar}
      renderBubble={renderBubble}
      placeholder={
        matchStatus === MATCH_STATUS_DISPUTED
          ? 'You cannot send messages as the match is in dispute..'
          : 'Type a message'
      }
      disableComposer={
        matchStatus === MATCH_STATUS_DISPUTED ||
        [TOURNAMENT_STATUS_OPEN_SIGNUP, TOURNAMENT_STATUS_CLOSED_SIGNUP].includes(tournamentStatus)
      }
      messages={props.messages}
      onSend={messages => props.onSend(messages)}
      user={{
        _id: userId,
        name: username,
        avatar: profileImage,
      }}
    />
  );
};

export default ChatBody;
