import React from 'react';
import {render as rtlRender} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components/native';
import Toast from 'react-native-toast-message';
import AuthService from '@duelme/apisdk/dist/services/AuthService';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {configureFontAwesomePro} from 'react-native-fontawesome-pro';
import {use} from 'i18next';
import {initReactI18next} from 'react-i18next';
import Amplify from '@aws-amplify/core';
import CognitoAuth from '@aws-amplify/auth';

import toastConfig from '../../components/Toast/config';
import theme, {paperTheme} from '../../global-styles/theme';
import {createStore} from '../../app/store';
import ModalContainer from '../../components/ModalContainer/ModalContainer';
import Spinner from '../../components/Spinner/Spinner';
import configureAxios from '../../../src/app/axiosConfig';
import global_en from '../../constants/en';

configureFontAwesomePro();

function reduxRender(ui, {initialState, middleware = [], ...renderOptions} = {}) {
  AuthService.configureAmplify({
    region: 'us-east-1',
    userPoolId: 'us-east-1_HYj35KWKV',
    userPoolWebClientId: '1ck4frqo6aio6ojp2o8m3eioua',
    Amplify,
    CognitoAuth,
  });
  use(initReactI18next).init({
    compatibilityJSON: 'v3',
    interpolation: {escapeValue: false},
    fallbackLng: 'en',
    resources: {
      en: {
        global: global_en,
      },
    },
  });
  const store = createStore(initialState, middleware);
  configureAxios(store);
  function Wrapper({children}) {
    return (
      <GestureHandlerRootView style={{flex: 1}}>
        <PaperProvider theme={paperTheme}>
          <Provider store={store}>
            <ThemeProvider theme={theme}>
              <NavigationContainer>{children}</NavigationContainer>
              <ModalContainer />
              <Spinner />
              <Toast config={toastConfig} />
            </ThemeProvider>
          </Provider>
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }

  return {
    ...rtlRender(ui, {wrapper: Wrapper, ...renderOptions}),
    store: store,
  };
}

// override render method
export {reduxRender};
