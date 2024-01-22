import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectCurrentUser,
  selectCurrentUserAccessToken,
  selectCurrentUserLoggedIn,
} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import AuthService from '@duelme/apisdk/dist/services/AuthService';
import {fetchGames} from '@duelme/apisdk/dist/slices/games/thunks';
import {fetchFeatureFlags, getMinimumAppVersion} from '@duelme/apisdk/dist/slices/featureFlags/thunks';
import {getCountryCodes} from '@duelme/apisdk/dist/slices/api/thunks';
import {selectFeatureFlags} from '@duelme/apisdk/dist/slices/featureFlags/selectors';
import {fetchWallets} from '@duelme/apisdk/dist/slices/wallets/thunks';
import {selectSocketConnected, selectSocketTopics} from '@duelme/apisdk/dist/slices/socket/selectors';
import {fetchUserStatus} from '@duelme/apisdk/dist/slices/userStatus/thunks';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import i18next from 'i18next';
import {initReactI18next, useTranslation} from 'react-i18next';
import {fetchBuyIns} from '@duelme/apisdk/dist/slices/buyIns/thunks';
import {fetchCurrentUser, setAccessToken} from '@duelme/apisdk/dist/slices/account/thunks';
import ReactNative, {Alert, Linking, AppState} from 'react-native';
import {fetchGameAccounts} from '@duelme/apisdk/dist/slices/gameAccounts/thunks';
import {selectCurrentMatchId} from '@duelme/apisdk/dist/slices/matches/selectors';
import {getVersion, getBundleId} from 'react-native-device-info';
import {fetchTournament} from '@duelme/apisdk/dist/slices/tournaments/thunks';
import {fetchMatch} from '@duelme/apisdk/dist/slices/matches/thunks';
import {STATUS_MATCH_IN_PROGRESS} from '@duelme/js-constants/dist/matches';
import {IN_TOURNAMENT_STATUS} from '@duelme/js-constants/dist/userStatus';
import {fetchQuickInvites} from '@duelme/apisdk/dist/slices/quickActions/thunks';
import {fetchFriendRequests} from '@duelme/apisdk/dist/slices/friendships/thunks';
import {fetchPendingNotifications} from '@duelme/apisdk/dist/slices/p3Notification/thunks';
import {pingStatus} from '@duelme/apisdk/dist/slices/users/thunks';

import global_en from './constants/en';
import MainDrawer from './components/MainDrawer/MainDrawer';
import {connectToSocket, subscribeToTopic} from './app/middlewares/socket/actions';
import LogIn from './features/Login/LogIn';
import Oauth from './features/Oauth/Oauth';
import OauthSignup from './features/OauthSignup/OauthSignup';
import AvatarCreation from './features/AvatarCreation/AvatarCreation';
import SignUp from './features/Signup/SignUp';
import ForgotPassword from './features/ForgotPassword/ForgotPassword';
import VerificationCodeStep from './features/VerificationCodeStep/VerificationCodeStep';
import LinkAccount from './features/LinkAccount/LinkAccount';
import Veriff from './features/Veriff/Veriff';
import ConfirmScreen from './features/ConfirmScreen/ConfirmScreen';
import WinnerScreen from './features/WinnerScreen/WinnerScreen';
import TermsOfService from './features/TermsOfService/TermsOfService';
import ChooseGame from './features/GetStarted/ChooseGame';
import ForgotUsername from './features/ForgotUsername/ForgotUsername';
import ConfirmationScreen from './features/ForgotUsername/ConfirmationScreen';
import Settings from './features/Settings/Settings';
import SettingsLinkAccount from './features/Settings/components/LinkAccount';
import SettingsLinkedAccounts from './features/Settings/components/LinkedAccounts';
import SettingsPersonal from './features/Settings/components/Personal';
import SettingsPrivacy from './features/Settings/components/Privacy';
import SettingsReferrals from './features/Settings/components/Referrals';
import SettingsSecurity from './features/Settings/components/Security';
import SettingsVerification from './features/Settings/components/Verification';
import SettingsStreaming from './features/Settings/components/Streaming';
import SettingsTaxes from './features/Settings/components/Taxes';
import {fetchNotifications} from './components/ModalContainer/modals/Notifications/Notifications';
import useSyncEndpointCall from './utils/syncEndpointCall';
import TaxForm from './features/TaxForm/TaxForm';
import TaxScreen from './features/TaxForm/TaxScreen';
import ConnectToTwitch from './features/ConnectToTwitch/ConnectToTwitch';

const Stack = createNativeStackNavigator();

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  interpolation: {escapeValue: false},
  fallbackLng: 'en',
  resources: {
    en: {
      global: global_en,
    },
  },
});

const MainAppNavigator = () => {
  const user = useSelector(selectCurrentUser);
  const socketConnected = useSelector(selectSocketConnected);
  const socketTopics = useSelector(selectSocketTopics);
  const featureFlags = useSelector(selectFeatureFlags);
  const dispatch = useDispatch();
  const syncEndpointCall = useSyncEndpointCall();
  const matchId = useSelector(selectCurrentMatchId);
  const [t] = useTranslation('global');
  const [stateChangeListener, setStateChangeListener] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const countryCodes = useSelector(state => state.currentUser.api.countries);
  const accessToken = useSelector(selectCurrentUserAccessToken);
  const isLoggedIn = !!accessToken;
  const currentUserIsLoggedIn = useSelector(selectCurrentUserLoggedIn);

  const hydrateData = async () => {
    syncEndpointCall({
      reduxAction: fetchCurrentUser(),
      avoidToast: () => true,
      // eslint-disable-next-line
      errorCallBack: error => {},
      successCallback: async () => {
        dispatch(fetchWallets());
        dispatch(fetchGameAccounts());
        dispatch(fetchQuickInvites());
        dispatch(fetchFriendRequests());
        dispatch(fetchPendingNotifications());
        const updatedUserStatus = await dispatch(fetchUserStatus());
        if (!updatedUserStatus.payload) {
          return;
        }
        const {status, data} = updatedUserStatus.payload;
        if (status === STATUS_MATCH_IN_PROGRESS) {
          await dispatch(fetchMatch(data.matchId));
        } else if (status === IN_TOURNAMENT_STATUS) {
          dispatch(fetchTournament({tournamentId: data?.tournamentId}));
          if (data?.matchId) {
            dispatch(fetchMatch(data?.matchId));
          }
        }
      },
    });
  };

  const handleAppStateChange = async nextAppState => {
    if (nextAppState === 'active') {
      checkAppVersion();
      hydrateData();
    }
  };

  useEffect(() => {
    setStateChangeListener(AppState.addEventListener('change', handleAppStateChange));
    return () => {
      if (stateChangeListener) {
        stateChangeListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (matchId) {
      let topic = `/topic/match-chat/${matchId}`;
      if (socketConnected && !Object.keys(socketTopics).includes(topic)) {
        dispatch(subscribeToTopic(topic));
      }
    }
  }, [dispatch, socketConnected, matchId, socketTopics]);

  useEffect(() => {
    dispatch(fetchBuyIns());
    dispatch(fetchGames());
    if (!featureFlags.pulled) {
      dispatch(fetchFeatureFlags());
    }
    if (countryCodes.length === 0) {
      dispatch(getCountryCodes());
    }
  }, []);

  useEffect(() => {
    if (featureFlags.pulled) {
      checkAppVersion();
    }
  }, [featureFlags]);

  useEffect(() => {
    if (currentUserIsLoggedIn) {
      hydrateData();
    } else {
      (async () => {
        if (await AuthService.getAccessToken()) {
          await dispatch(setAccessToken());
          hydrateData();
        }
      })();
    }
  }, [accessToken]);

  useEffect(() => {
    if (isLoggedIn && user && user !== 'INIT' && !socketConnected) {
      (async () => {
        const cognitoUser = await AuthService.getCognitoUser();
        if (cognitoUser) {
          dispatch(connectToSocket(user.id, cognitoUser.username));
        }
      })();
      fetchNotifications(dispatch);
    }
  }, [user, connectToSocket, socketConnected]);

  const removeInterval = intIntervalId => {
    if (intIntervalId) {
      clearInterval(intIntervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (intervalId === null) {
        dispatch(pingStatus());
        setIntervalId(
          setInterval(() => {
            dispatch(pingStatus());
          }, 30000),
        );
      }
    } else {
      removeInterval(intervalId);
    }
    return () => removeInterval(intervalId);
  }, [user, intervalId]);

  const checkAppVersion = async () => {
    const {payload} = await dispatch(getMinimumAppVersion());
    const currentVersion = getVersion().match(/^(\d+\.\d+)/)[0];
    if (parseFloat(currentVersion) < payload[ReactNative.Platform.OS]) {
      Alert.alert(
        t('update_required'),
        t('update_description'),
        [
          {
            text: t('update'),
            onPress: () => {
              ReactNative.Platform.OS === 'android'
                ? featureFlags.apkDirectDownload
                  ? openDirectDownload()
                  : openGooglePlay()
                : openAppStore();
            },
          },
        ],
        {
          cancelable: false,
        },
      );
    }
  };

  const openAppStore = () => {
    const link = 'itms-apps://apps.apple.com/us/app/dubbz/id1626037683';
    Linking.canOpenURL(link).then(supported => {
      supported && Linking.openURL(link);
    });
  };

  const openGooglePlay = () => {
    const id = getBundleId();
    Linking.openURL(`http://play.google.com/store/apps/details?id=${id}`);
  };

  const openDirectDownload = () => {
    Linking.openURL('https://dubbz-prod-assets.s3.amazonaws.com/static/web/latest-build.apk');
  };

  return (
    <Stack.Navigator screenOptions={ReactNative.Platform.OS === 'android' && {animation: 'none'}}>
      {user && user !== 'INIT' ? (
        <Stack.Group>
          <Stack.Screen
            name="DrawerNavigator"
            component={MainDrawer}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LinkAccount"
            component={LinkAccount}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Veriff"
            component={Veriff}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TaxForm"
            component={TaxForm}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TaxScreen"
            component={TaxScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ChooseGame"
            component={ChooseGame}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
            name={'WinnerScreen'}
            component={WinnerScreen}
          />
          <Stack.Group>
            {/*Settings*/}
            <Stack.Screen
              name="Settings"
              component={Settings}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsLinkAccount"
              component={SettingsLinkAccount}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsLinkedAccounts"
              component={SettingsLinkedAccounts}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsPersonal"
              component={SettingsPersonal}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsPrivacy"
              component={SettingsPrivacy}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsReferrals"
              component={SettingsReferrals}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsSecurity"
              component={SettingsSecurity}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsVerification"
              component={SettingsVerification}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsStreaming"
              component={SettingsStreaming}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SettingsTaxes"
              component={SettingsTaxes}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>
          <Stack.Screen
            name="AvatarCreation"
            component={AvatarCreation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ConnectToTwitch"
            component={ConnectToTwitch}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={LogIn}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Oauth"
            component={Oauth}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="OauthSignup"
            component={OauthSignup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ForgotUsername"
            component={ForgotUsername}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ConfirmationScreen"
            component={ConfirmationScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="VerificationCodeStep"
            component={VerificationCodeStep}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="TermsOfService"
            component={TermsOfService}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="ConfirmScreen"
            component={ConfirmScreen}
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default MainAppNavigator;
