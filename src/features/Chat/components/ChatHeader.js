import React from 'react';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {PUBLIC_USER_STATUS_TEXT} from '@duelme/js-constants/dist/friends';
import {GAME_NAMES} from '@duelme/js-constants/dist/games';
import {selectGameById} from '@duelme/apisdk/dist/slices/games/selectors';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-fontawesome-pro';

import {StatusContainer, StatusText} from '../../FriendsTab/components/chatContent/ChatContent.styles';
import theme from '../../../global-styles/theme';
import AvatarProfile from '../../../components/AvatarProfile';

const Container = styled.View`
  height: ${hp(9)}px;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16px;
  border-bottom-color: ${({theme}) => theme.colors.grey};
  border-bottom-width: 1px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  align-items: center;
`;

const IconContainer = styled.TouchableOpacity``;

const AvatarView = styled.View`
  margin-left: ${wp(4)}px;
  justify-content: center;
  flex-direction: row;
  shadow-radius: 6px;
  shadow-opacity: 1px;
  shadow-color: ${({theme}) => theme.colors.vividBlue};
`;

const NickNameContainer = styled.View`
  justify-content: center;
  margin-left: 12px;
  align-self: center;
`;

const NickName = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-weight: bold;
  font-size: ${wp(3.5)}px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
`;

const Button = styled.TouchableOpacity`
  justify-content: center;
  margin-horizontal: ${wp(4)}px;
`;

const ChatHeader = ({
  friend,
  challengeFriend,
  challengeDisabled,
  matchStatus,
  matchMode = false,
  opponentCaptain,
  tournamentStatus,
  tournamentMode = false,
  tournamentName,
}) => {
  const navigation = useNavigation();
  const game = useSelector(state => selectGameById(state, friend?.gameId));
  const [t] = useTranslation('global');

  const statusText = matchStatus
    ? matchStatus
    : tournamentStatus
    ? tournamentStatus
    : PUBLIC_USER_STATUS_TEXT[friend?.status]?.replace('GAME', GAME_NAMES[game?.name]);

  return (
    <Container>
      <Row>
        <IconContainer onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="solid" size={wp('6%')} color={theme.colors.white} />
        </IconContainer>
        {tournamentMode ? (
          <>
            <NickNameContainer>
              <NickName>{tournamentName}</NickName>
              <StatusContainer contentContainerStyle={{alignItems: 'center'}} horizontal={true}>
                <StatusText isOnline={false}>{t(`tournamentStatuses.${tournamentStatus}`)}</StatusText>
              </StatusContainer>
            </NickNameContainer>
          </>
        ) : matchMode ? (
          <>
            <AvatarView>
              <AvatarProfile
                imageSize={45}
                displayStatus={false}
                online={friend?.online}
                source={{uri: friend?.profileImage}}
                isPro={friend?.proMembership}
              />
              <AvatarProfile
                imageSize={45}
                displayStatus={false}
                online={opponentCaptain?.online}
                source={{uri: opponentCaptain?.profileImage}}
                isPro={opponentCaptain?.proMembership}
              />
            </AvatarView>
            <NickNameContainer>
              <NickName>{t('chat.matchChat')}</NickName>
              <StatusContainer contentContainerStyle={{alignItems: 'center'}} horizontal={true}>
                <StatusText isOnline={false}>{t(matchStatus)}</StatusText>
              </StatusContainer>
            </NickNameContainer>
          </>
        ) : (
          <>
            <AvatarView>
              <AvatarProfile
                imageSize={45}
                displayStatus={true}
                online={friend?.online}
                source={{uri: friend?.profileImage}}
                isPro={friend?.proMembership}
              />
            </AvatarView>
            <NickNameContainer>
              <NickName>{friend?.username}</NickName>
              <StatusContainer horizontal={true}>
                <StatusText isOnline={friend?.online}>{statusText}</StatusText>
              </StatusContainer>
            </NickNameContainer>
          </>
        )}
      </Row>
      {!matchMode && (
        <ButtonsContainer>
          <Button onPress={() => challengeFriend(friend?.id)} disabled={challengeDisabled}>
            <Icon
              name="swords"
              size={wp('6%')}
              type="solid"
              color={challengeDisabled ? theme.colors.grey : theme.colors.white}
            />
          </Button>
        </ButtonsContainer>
      )}
    </Container>
  );
};

export default ChatHeader;
