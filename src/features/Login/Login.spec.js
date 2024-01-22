import React from 'react';
import {act, fireEvent, waitFor} from '@testing-library/react-native';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import AuthService from '@duelme/apisdk/dist/services/AuthService';
import Toast from 'react-native-toast-message';
import RegionService from '@duelme/apisdk/dist/services/RegionService';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';

import {mockedNavigate} from '../../../jest.setup';
import {reduxRender} from '../../utils/tests/reduxRender';
import {server} from '../../common/tests/mockServer/server';

import Login from './LogIn';

describe('Login', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  it('does render username and password inputs', async () => {
    const wrapper = reduxRender(<Login />, {});
    await wrapper.findByTestId('usernameInput');
    await wrapper.findByTestId('passwordInput');
  });
  it('disable button if no username', async () => {
    const wrapper = reduxRender(<Login />, {});
    await wrapper.findByTestId('disabledLoginButton');
  });
  it('disable button if username but no password', async () => {
    const wrapper = reduxRender(<Login />, {});
    fireEvent.changeText(await wrapper.findByTestId('usernameInput'), 'user1');
    await wrapper.findByTestId('disabledLoginButton');
  });
  it('enable button if username and password', async () => {
    const wrapper = reduxRender(<Login />, {});
    fireEvent.changeText(await wrapper.findByTestId('usernameInput'), 'user1');
    fireEvent.changeText(await wrapper.findByTestId('passwordInput'), 'password');
    await wrapper.findByTestId('disabledLoginButton');
  });

  it('calls cognito login and show toast message if not correct credentials', async () => {
    jest.spyOn(AuthService, 'authenticateUser').mockReturnValue(new Promise((resolve, reject) => reject()));
    jest.spyOn(RegionService, 'checkRegion').mockReturnValue(new Promise(resolve => resolve()));

    jest.spyOn(Toast, 'show').mockReturnValue(new Promise((resolve, reject) => reject()));

    const wrapper = reduxRender(<Login />, {});
    const usernameField = await wrapper.findByTestId('usernameInput');
    await act(async () => {
      await fireEvent.changeText(usernameField, 'user1');
    });
    const passwordField = await wrapper.findByTestId('passwordInput');
    await act(async () => {
      await fireEvent.changeText(passwordField, 'password');
    });

    await act(async () => {
      await fireEvent.press(await wrapper.findByTestId('enabledLoginButton'));
    });

    await waitFor(
      () => {
        expect(AuthService.authenticateUser).toBeCalledWith({
          password: 'password',
          username: 'user1',
        });
      },
      {
        timeout: 3000,
      },
    );
    await waitFor(
      () => {
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'Invalid username or password',
        });
      },
      {
        timeout: 3000,
      },
    );
  });

  it('takes you to forgot when clicking forgot password', async () => {
    const wrapper = reduxRender(<Login />, {});
    fireEvent.press(await wrapper.findByText('Forgot password?'));

    await waitFor(() => {
      expect(mockedNavigate).toBeCalledWith('ForgotPassword');
    });
  });

  it('takes you to signup page when clicking signup', async () => {
    const wrapper = reduxRender(<Login />, {});
    fireEvent.press(await wrapper.findByText('Sign up'));

    await waitFor(() => {
      expect(mockedNavigate).toBeCalledWith('Signup');
    });
  });

  it('calls api with correct parameters with correct crendetial and create token for mobile', async () => {
    const axios = AxiosService.getAxios();

    jest.spyOn(AuthService, 'authenticateUser').mockReturnValue(new Promise(resolve => resolve('test-payload')));
    jest.spyOn(RegionService, 'checkRegion').mockReturnValue(new Promise(resolve => resolve()));

    jest.spyOn(axios, 'post').mockReturnValue(new Promise(resolve => resolve({data: []})));
    jest.spyOn(axios, 'get').mockReturnValue(new Promise(resolve => resolve({data: []})));
    jest.spyOn(Toast, 'show').mockReturnValue(new Promise((resolve, reject) => reject()));

    const wrapper = reduxRender(<Login />, {});
    const usernameField = await wrapper.findByTestId('usernameInput');
    await act(async () => {
      await fireEvent.changeText(usernameField, 'user1');
    });
    const passwordField = await wrapper.findByTestId('passwordInput');
    await act(async () => {
      await fireEvent.changeText(passwordField, 'password');
    });

    await act(async () => {
      await fireEvent.press(await wrapper.findByTestId('enabledLoginButton'));
    });

    await waitFor(
      () => {
        expect(AuthService.authenticateUser).toBeCalledWith({
          password: 'password',
          username: 'user1',
        });
      },
      {
        timeout: 3000,
      },
    );
    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`${BASE_APP_API_URL}/users/me/mobile/tokens`, {token: 'TEST-TOKEN'});
      },
      {
        timeout: 3000,
      },
    );
  });

  it('calls api with correct parameters with correct crendetials and does not create token for mobile', async () => {
    const axios = AxiosService.getAxios();

    jest.spyOn(AuthService, 'authenticateUser').mockReturnValue(new Promise(resolve => resolve('test-payload')));
    jest.spyOn(RegionService, 'checkRegion').mockReturnValue(new Promise(resolve => resolve()));

    jest.spyOn(axios, 'post').mockReturnValue(new Promise(resolve => resolve({data: []})));
    jest.spyOn(axios, 'get').mockReturnValue(new Promise(resolve => resolve({data: ['TEST-TOKEN']})));
    jest.spyOn(Toast, 'show').mockReturnValue(new Promise((resolve, reject) => reject()));

    const wrapper = reduxRender(<Login />, {});
    const usernameField = await wrapper.findByTestId('usernameInput');
    await act(async () => {
      await fireEvent.changeText(usernameField, 'user1');
    });
    const passwordField = await wrapper.findByTestId('passwordInput');
    await act(async () => {
      await fireEvent.changeText(passwordField, 'password');
    });

    await act(async () => {
      await fireEvent.press(await wrapper.findByTestId('enabledLoginButton'));
    });

    await waitFor(
      () => {
        expect(AuthService.authenticateUser).toBeCalledWith({
          password: 'password',
          username: 'user1',
        });
      },
      {
        timeout: 3000,
      },
    );
    await waitFor(
      () => {
        expect(axios.post).toHaveBeenCalledTimes(0);
      },
      {
        timeout: 3000,
      },
    );
  });
});
