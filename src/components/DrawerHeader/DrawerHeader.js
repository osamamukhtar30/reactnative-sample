import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import {selectHasPendingNotifications} from '@duelme/apisdk/dist/slices/p3Notification/selectors';
import {clearPendingNotifications} from '@duelme/apisdk/dist/slices/p3Notification/thunks';
import {selectActiveStatus} from '@duelme/apisdk/dist/slices/userStatus/selectors';
import {BubblesLoader} from 'react-native-indicator';
import {USER_STATUS_BANNED, USER_STATUS_PERMABAN} from '@duelme/js-constants/dist/userStatus';
import {useTranslation} from 'react-i18next';
import {cleanBan} from '@duelme/apisdk/dist/slices/userStatus/native';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import BlurViewContainer from '../BlurViewContainer/BlurViewContainer';

import ProfileImage from './../ProfileImage/ProfileImage';
import ConnectWallet from './../ConnectWallet/ConnectWallet';
import theme from './../../global-styles/theme';
import UserInfo from './components/UserInfo';
import NotificationIcon from './components/NotificationIcon';
import BurguerMenu from './components/BurguerMenu';
import CloseIcon from './components/CloseIcon';
import CountDown from './../CountDown/CountDown';

const PositionFixer = styled.View`
  position: absolute;
  top: 5px;
  left: 0px;
  right: 0px;
  z-index: 1;
`;

const Container = styled.View`
  margin: auto;
  margin-top: ${({marginTopInset}) => marginTopInset}px;
  height: ${hp(9)}px;
  width: ${wp(92)}px;
`;

const BorderGradiantContainer = styled(LinearGradient)`
  height: 100%;
  border-radius: ${hp(5)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: rgba(0, 0, 0, 0.2);
`;

const GradiantContainer = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

const LocalContainer = styled(GradiantContainer)`
  border-radius: ${hp(5)}px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);
  padding: 1px;
`;

const RightContainer = styled.View`
  margin-left: auto;
  margin-right: 8%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  ${({drawerOpened}) =>
    !drawerOpened &&
    `
    width: 30%;
  `}
`;

const BANNED_STATUSES = [USER_STATUS_BANNED, USER_STATUS_PERMABAN];

const BannedOutContainer = styled.View`
  position: absolute;
  border-radius: ${hp(5) - 2.5}px;
  width: 60%;
  height: ${hp(9) - 5}px;
  z-index: 1;
  flex-direction: column;
  background-color: rgba(255, 0, 0, 0.3);
`;

const BannedInContainer = styled.TouchableOpacity`
  width: 100%;
  height: 100%;
  display: flex;
  padding-top: ${hp(1.5)}px;
  align-items: center;
  justify-content: center;
`;

const BannedText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-weight: bold;
  text-transform: uppercase;
`;

const LoadingRow = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const DrawerHeader = ({closeCallback = null, blurContext}) => {
  const user = useSelector(selectCurrentUser);
  const hasPndingNotifications = useSelector(selectHasPendingNotifications);
  const dispatch = useDispatch();
  const currentUserStatus = useSelector(selectActiveStatus);
  const statusData = useSelector(state => state.currentUser?.status?.data);
  const [t] = useTranslation('global');
  const insets = useSafeAreaInsets();

  return (
    <PositionFixer>
      <Container marginTopInset={insets.top}>
        <BorderGradiantContainer
          colors={blurContext ? ['transparent', 'transparent'] : [theme.colors.vividBlue, theme.colors.trueBlue]}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
        >
          <LocalContainer
            colors={
              blurContext
                ? ['transparent', 'transparent']
                : [theme.colors.vividBlue, theme.colors.trueBlue, theme.colors.darkPurple]
            }
            start={{x: 0, y: 9}}
            end={{x: 0, y: 0}}
          >
            {BANNED_STATUSES.includes(currentUserStatus) && (
              <BannedOutContainer>
                <BlurViewContainer borderRadius={hp(5) - 6} blurType="dark" androidRgb={'50, 0, 0'}>
                  <BannedInContainer
                    onPress={() => {
                      dispatch(
                        openModal('banned', {
                          currentUserStatus,
                          statusData,
                        }),
                      );
                    }}
                  >
                    <BannedText>{t('you_are_banned')}</BannedText>
                    <LoadingRow>
                      <BubblesLoader dotRadius={hp(5) * 0.15} color={theme.colors.white} size={hp(2)} />
                      <CountDown
                        displayIcon={false}
                        targetTime={statusData?.endDate}
                        onFinished={() => {
                          dispatch(cleanBan());
                        }}
                        textStyle={{fontWeight: 'bold'}}
                      />
                    </LoadingRow>
                  </BannedInContainer>
                </BlurViewContainer>
              </BannedOutContainer>
            )}
            <ProfileImage
              isPro={user.proMembership}
              blueVariant
              image={user.profileImage}
              transparentBackground={blurContext}
            />
            <UserInfo username={user.username} />
            <RightContainer drawerOpened={!!closeCallback}>
              {closeCallback ? (
                <>
                  <CloseIcon onPress={closeCallback} />
                </>
              ) : (
                <>
                  <ConnectWallet />
                  <NotificationIcon
                    hasNew={hasPndingNotifications}
                    onPress={() => {
                      dispatch(clearPendingNotifications());
                      dispatch(openModal('notifications'));
                    }}
                  />
                  <BurguerMenu />
                </>
              )}
            </RightContainer>
          </LocalContainer>
        </BorderGradiantContainer>
      </Container>
    </PositionFixer>
  );
};

export default DrawerHeader;
