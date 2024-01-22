import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentUserTwitchAccount} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import Icon from 'react-native-fontawesome-pro';
import {Trans, useTranslation} from 'react-i18next';
import {Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import {enableTwitchPastBroadcasts, unlinkTwitchAccount} from '@duelme/apisdk/dist/slices/account/thunks';

import useSyncEndpointCall from '../../utils/syncEndpointCall';
import theme from '../../global-styles/theme';
import EmptyState from '../EmptyState/EmptyState';

import Switch from './../Inputs/Switch';
import Button from './../button/Button';

const Text = styled.Text`
  color: ${({theme}) => theme.colors.white};
  text-align: center;
`;

const Bold = styled(Text)`
  font-weight: bold;
`;

const Link = styled(Bold)`
  color: ${({theme}) => theme.colors.red};
  text-decoration-line: underline;
`;

const Container = styled.View`
  width: ${({fromSettings}) => (fromSettings ? '100%' : '90%')};
  background-color: transparent;
  margin: 0px auto;
  display: flex;
  flex-grow: 1;
`;

const ConnectToTwitch = ({fromSettings, callback}) => {
  const [loading, setLoading] = useState(false);
  const twitchAccount = useSelector(selectCurrentUserTwitchAccount);
  const [t] = useTranslation('global');
  const [confirmed, setConfirmed] = useState(false);
  const syncEndpointCall = useSyncEndpointCall();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleEnable = async () => {
    setLoading(true);
    await syncEndpointCall({
      avoidOpenLoading: true,
      avoidCloseLoading: true,
      loadingText: t('updating_twitch_info'),
      reduxAction: enableTwitchPastBroadcasts({hasEnabledPastBroadbasts: true}),
      errorCallBack: () => {
        if (callback) {
          callback();
        } else {
          setLoading(false);
        }
      },
      successCallback: () => {
        if (callback) {
          callback();
        } else {
          setLoading(false);
          navigation.goBack();
        }
      },
    });
  };

  useEffect(() => {
    if (twitchAccount && twitchAccount.hasEnabledPastBroadcasts && !fromSettings) {
      navigation.goBack();
    }
  }, [twitchAccount]);

  return (
    <Container testID="connect-to-twitch-component" fromSettings={fromSettings}>
      {twitchAccount && !fromSettings ? (
        <>
          <EmptyState
            background="purple"
            innerContent={<Icon name={'twitch'} type="brands" color={theme.colors.white} size={wp(30)} />}
            info={
              <Trans
                t={t}
                i18nKey="enable_past_broadcast"
                components={{
                  bold: <Bold></Bold>,
                  linking: (
                    <Link
                      onPress={() => {
                        Linking.canOpenURL(
                          `https://dashboard.twitch.tv/u/${twitchAccount?.displayName}/settings/stream`,
                        ).then(supported => {
                          if (supported) {
                            Linking.openURL(
                              `https://dashboard.twitch.tv/u/${twitchAccount?.displayName}/settings/stream`,
                            );
                          }
                        });
                      }}
                    ></Link>
                  ),
                }}
              />
            }
            button={
              <>
                <Switch
                  testID="confirm-past-broadcast"
                  label={t('i_confirm_that_i_have_enabled_past_broadcast')}
                  onValueChange={newValue => {
                    setConfirmed(newValue);
                  }}
                  value={confirmed}
                />
                <Button
                  testID={!confirmed ? 'done-disabled' : 'done-enabled'}
                  loading={loading}
                  fullWidth
                  text={t('done')}
                  disabled={!confirmed}
                  onPress={handleEnable}
                />
              </>
            }
          />
        </>
      ) : (
        <>
          <EmptyState
            background="purple"
            innerContent={<Icon name={'twitch'} type="brands" color={theme.colors.white} size={wp(30)} />}
            titleRowOne={fromSettings && twitchAccount ? t('twitch_connected') : t('connect_twitch')}
            info={
              fromSettings && twitchAccount ? twitchAccount?.displayName : t('to_play_games_that_require_streaming')
            }
            button={
              <Button
                testID={fromSettings && twitchAccount ? 'unlinkTwitch' : 'linkTwitch'}
                loading={loading}
                onPress={async () => {
                  if (fromSettings && twitchAccount) {
                    await syncEndpointCall({
                      loadingText: t('unlinking_twitch_account'),
                      reduxAction: unlinkTwitchAccount(),
                      errorText: t('twitch_account_was_not_unlinked'),
                    });
                  } else {
                    dispatch(openModal('twitchOauth'));
                  }
                }}
                text={fromSettings && twitchAccount ? t('unlink_twitch') : t('connect_twitch')}
                fullWidth
                secondaryColors={fromSettings ? [theme.colors.paradisePink, theme.colors.darkPurple] : undefined}
                solidColor={fromSettings && twitchAccount ? 'transparent' : false}
                borderColor={theme.colors.white}
              />
            }
          />
        </>
      )}
    </Container>
  );
};

export default ConnectToTwitch;
