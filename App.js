import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from 'styled-components/native';
import {Provider} from 'react-redux';
import {
  POLYGON_NETWORK_ID,
  REACT_APP_COGNITO_APP_REGION,
  REACT_APP_COGNITO_USER_POOL_ID,
  REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
  REACT_APP_OAUTH_DOMAIN,
  SENTRY,
} from 'react-native-dotenv';
import AuthService from '@duelme/apisdk/dist/services/AuthService';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider as PaperProvider} from 'react-native-paper';
import {configureFontAwesomePro} from 'react-native-fontawesome-pro';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import {withWalletConnect} from '@walletconnect/react-native-dapp';
import * as Sentry from '@sentry/react-native';
import Amplify from '@aws-amplify/core';
import CognitoAuth from '@aws-amplify/auth';

import Spinner from './src/components/Spinner/Spinner';
import toastConfig from './src/components/Toast/config';
import FunctionsForwarder from './src/components/FunctionsForwarder/FunctionsForwarder';
import BabylonEngineContext from './src/components/BabylonEngineContext/BabylonEngineContext';
import MainNavigator from './src/mainNavigator';
import theme, {paperTheme} from './src/global-styles/theme';
import {createStore} from './src/app/store';
import configureAxios from './src/app/axiosConfig';
import ModalContainer from './src/components/ModalContainer/ModalContainer';

AuthService.configureAmplify({
  region: REACT_APP_COGNITO_APP_REGION,
  userPoolId: REACT_APP_COGNITO_USER_POOL_ID,
  userPoolWebClientId: REACT_APP_COGNITO_USER_POOL_WEB_CLIENT_ID,
  Amplify,
  CognitoAuth,
  oauth: {
    name: 'OauthApp',
    domain: REACT_APP_OAUTH_DOMAIN,
    scope: ['openid'],
    responseType: 'code',
    redirectSignIn: 'dubbz://oauth/login',
    redirectSignOut: 'dubbz://login',
  },
});

const linking = {
  prefixes: ['dubbz://'],
  config: {
    initialRouteName: 'Login',
    screens: {
      Login: {
        path: 'login',
      },
      DrawerNavigator: {
        path: 'home',
      },
      Signup: {
        path: 'signup',
      },
      ForgotPassword: {
        path: 'forgotpassword',
      },
      ForgotUsername: {
        path: 'forgotusername',
      },
      Oauth: {
        path: 'oauth/login',
      },
    },
  },
};

configureFontAwesomePro();

export const store = createStore();

configureAxios(store);
SplashScreen.hide();

function App() {
  React.useEffect(() => {
    Sentry.init({
      dsn: SENTRY,
    });
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider theme={paperTheme}>
        <SafeAreaProvider>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <NavigationContainer linking={linking} theme={{colors: {background: theme.colors.darkPurple}}}>
                <BabylonEngineContext>
                  <MainNavigator />
                </BabylonEngineContext>
                <FunctionsForwarder />
              </NavigationContainer>
              <ModalContainer />
              <Spinner />
            </ThemeProvider>
          </Provider>
        </SafeAreaProvider>
      </PaperProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(
  withWalletConnect(App, {
    chainId: parseInt(POLYGON_NETWORK_ID),
    redirectUrl: 'dubbz://',
    storageOptions: {
      asyncStorage: AsyncStorage,
    },
  }),
);
