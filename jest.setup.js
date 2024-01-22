import React from 'react';
import {View} from 'react-native';
import mock from '@gorhom/bottom-sheet/mock';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import 'react-native-gesture-handler/jestSetup';
import {createAsyncThunk} from '@reduxjs/toolkit';
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
import '@testing-library/jest-native/extend-expect';

const {WebView} = jest.requireActual('react-native-webview');

global.console.warn = message => {
  throw message;
};

global.console.error = message => {
  throw message;
};
jest.mock('react-native-safe-area-context', () => {
  return {
    ...mockSafeAreaContext,
    useSafeAreaInsets: jest.fn().mockImplementation(() => {
      return {top: 0, left: 0, right: 0, bottom: 0};
    }),
  };
});

jest.mock('@react-navigation/elements', () => {
  const actualElements = jest.requireActual('@react-navigation/elements');
  return {
    ...actualElements,
    useHeaderHeight: jest.fn().mockReturnValue(100),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-responsive-screen');

jest.mock('react-native-permissions');

jest.mock('@gorhom/bottom-sheet', () => ({
  ...mock,
  __esModule: true,
}));

jest.mock('react-native/Libraries/LogBox/LogBox');

export const mockedShare = jest.fn();

jest.mock('react-native-share', () => ({
  open: mockedShare,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: jest.fn(),
}));

export const mockConnector = {
  killSession: jest.fn(),
};

jest.mock('@walletconnect/react-native-dapp', () => ({
  withWalletConnect: param => param,
  useWalletConnect: jest.fn().mockReturnValue(mockConnector),
}));

export const mockMessaging = {
  getToken: jest.fn().mockReturnValue(new Promise(resolve => resolve('TEST-TOKEN'))),
};

jest.mock('@react-native-firebase/messaging', () => jest.fn().mockReturnValue(mockMessaging));

export const mockCanvasProps = jest.fn();

const mockCanvas = props => {
  React.useEffect(() => {
    mockCanvasProps(props);
    props.setImage('data:testing-image');
  }, [props]);

  return <View testID="testing-canvas"></View>;
};

mockCanvas.displayName = 'MockCanvas';

jest.mock('./src/components/Canvas/Canvas', () => mockCanvas);

export const mockActionSheetShow = jest.fn();
export const mockActionSheetProps = jest.fn();

const mockActionSheet = React.forwardRef((props, ref) => {
  React.useEffect(() => {
    mockActionSheetProps(props);
  }, [props]);

  React.useImperativeHandle(ref, () => ({
    show: mockActionSheetShow,
  }));

  return <View testID="testing-action-sheet"></View>;
});

mockActionSheet.displayName = 'MockActionSheet';

jest.mock('react-native-actionsheet', () => mockActionSheet);

export const mockReportScore = jest.fn();

const mockReportScoreThunk = createAsyncThunk('matches/reportScore/test', async params => {
  mockReportScore(params);
  return {};
});

export const mockReportIssue = jest.fn();

const mockReportIssueThunk = createAsyncThunk('matches/reportIssue/test', async params => {
  mockReportIssue(params);
  return {};
});

jest.mock('@duelme/apisdk/dist/slices/matches/thunks', () => {
  const actualThunks = jest.requireActual('@duelme/apisdk/dist/slices/matches/thunks');
  return {
    ...actualThunks,
    reportScore: mockReportScoreThunk,
    reportIssue: mockReportIssueThunk,
  };
});

export const mockLaunchCamera = jest.fn();
export const mockLaunchImageLibrary = jest.fn();

jest.mock('react-native-image-picker', () => ({
  launchCamera: mockLaunchCamera,
  launchImageLibrary: mockLaunchImageLibrary,
}));

export const mockedNavigate = jest.fn();
export const mockedGoBack = jest.fn();
export const mockedPop = jest.fn();
export const mockedNavigationDispatch = jest.fn();

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      dispatch: mockedNavigationDispatch,
      goBack: mockedGoBack,
      pop: mockedPop,
    }),
    useRoute: jest.fn(),
    getFocusedRouteNameFromRoute: jest.fn(),
  };
});

//replaceAll is undefined in jest env
if (typeof String.prototype.replaceAll === 'undefined') {
  String.prototype.replaceAll = function (match, replace) {
    return this.replace(new RegExp(match, 'g'), () => replace);
  };
}

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);
jest.mock('react-native/Libraries/LayoutAnimation/LayoutAnimation', () => ({
  ...jest.requireActual('react-native/Libraries/LayoutAnimation/LayoutAnimation'),
  configureNext: jest.fn(),
}));

export const mockWebView = {
  postMessage: jest.fn(),
};

const MockWebView = React.forwardRef((props, ref) => {
  React.useImperativeHandle(ref, () => mockWebView);

  return <WebView {...props} ref={ref} />;
});

MockWebView.displayName = 'MockWebView';

jest.mock('react-native-webview', () => MockWebView);

jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent');
  return mockComponent('react-native/Libraries/Components/Switch/Switch');
});
