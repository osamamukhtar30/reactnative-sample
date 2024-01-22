import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {MATCH_STATUS_DISPUTED} from '@duelme/js-constants/dist/matches';

import theme from '../../../../global-styles/theme';

export const FriendContainer = styled.View`
  display: flex;
  flex-direction: row;
`;

export const FriendRowContainer = styled.View`
  margin: 2px auto;
  width: 90%
  padding: ${hp('1%')}px ${wp('3%')}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-color: ${({matchStatus, isGreen}) =>
    isGreen
      ? theme.colors.green
      : matchStatus
      ? matchStatus === MATCH_STATUS_DISPUTED
        ? 'rgb(200,147,34)'
        : 'rgb(61,169,57)'
      : 'rgba(255,255,255,0.3)'}};
  border-width: 1px;
  align-self: center;
`;

export const AvatarProfileContainer = styled.View``;

export const MatchProfileContainer = styled.View`
  flex-direction: row;
  shadow-radius: 6px;
  shadow-opacity: 1;
  shadow-color: ${theme.colors.vividBlue};
  background-color: transparent;
`;
export const UserDataContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-left: ${hp('1.5%')}px;
  width: 45%;
  margin-right: ${hp('1%')}px;
`;

export const StatusContainer = styled.ScrollView`
  flex-direction: row;
  max-height: ${wp('4%')}px;
`;

export const StatusText = styled.Text`
  font-size: ${wp('3%')}px;
  height: ${wp('4%')}px;
  color: ${props =>
    props.matchStatus
      ? props.matchStatus === MATCH_STATUS_DISPUTED
        ? 'rgb(200,147,34)'
        : 'rgb(61,169,57)'
      : props.isOnline
      ? theme.colors.green
      : theme.colors.grey};
  font-family: Decimal-Medium;
`;
export const TournamentStatusText = styled.Text`
  font-size: ${wp('3%')}px;
  height: ${wp('4%')}px;
  color: ${props => (props.isGreen ? theme.colors.green : theme.colors.grey)};
  font-family: Decimal-Medium;
`;

export const NotificationCountContainer = styled.View`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

export const NotificationCount = styled.Text`
  color: ${theme.colors.white};
  padding: 0px 10px;
  border-radius: 5px;
  background-color: ${theme.colors.violet};
`;

export const ActionsContainer = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

export const ActionContainer = styled.TouchableOpacity`
  margin-right: 4%;
`;
export const UnreadBubble = styled.View`
  position: absolute;
  height: 10px;
  width: 10px;
  border-radius: 5px;
  top: -3px;
  right: -3px;
  background-color: ${theme.colors.red};
`;

export const NickNameText = styled.Text`
  font-size: ${wp('3%')}px;
  color: ${theme.colors.white};
  font-family: 'Decimal-Medium';
  margin-bottom: 3px;
`;

export const StatusDot = styled.Text`
  margin-left: ${wp('2.5%')}px;
  margin-top: ${hp('0.5%')}px;
  width: ${wp('0.5%')}px;
  height: ${hp('0.5%')}px;
  border-radius: 5px;
  border-width: 5px;
  color: ${props => (props.online ? theme.colors.green : theme.colors.red)};
  border-color: ${props => (props.online ? theme.colors.green : theme.colors.red)};
`;
