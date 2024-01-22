import React from 'react';
import {fireEvent, act, waitFor} from '@testing-library/react-native';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import * as modal from '@duelme/apisdk/dist/slices/modal/native';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';

import {server} from '../../common/tests/mockServer/server';

import {reduxRender} from './../../utils/tests/reduxRender';
import ConnectToTwitch from './ConnectToTwitch';

describe('ConnectToTwitch', () => {
  beforeAll(() => {
    server.listen();
    jest.useFakeTimers();
  });
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  const axios = AxiosService.getAxios();

  it('renders connect-to-twitch-component', async () => {
    const wrapper = reduxRender(<ConnectToTwitch />, {});
    await wrapper.findByTestId('connect-to-twitch-component');
  });

  it('renders connect to twitch and click buttons open twitch modal', async () => {
    const openModalMock = jest.spyOn(modal, 'openModal');
    const initialState = {
      currentUser: {
        ...mockCurrentUser,
        account: {
          ...mockCurrentUser.account,
          twitchAccount: null,
        },
      },
    };
    const wrapper = reduxRender(<ConnectToTwitch />, {initialState});
    await wrapper.findAllByText('Connect twitch');
    const linkTwitchButton = await wrapper.findByTestId('linkTwitch');
    act(() => fireEvent.press(linkTwitchButton));
    await waitFor(() => {
      expect(openModalMock).toHaveBeenCalledTimes(1);
      expect(openModalMock).toBeCalledWith('twitchOauth');
    });
  });

  it('renders unlink twitch and click buttons open twitch modal', async () => {
    const initialState = {
      currentUser: mockCurrentUser,
    };
    jest.spyOn(axios, 'delete').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    const wrapper = reduxRender(<ConnectToTwitch fromSettings={true} />, {initialState});
    await wrapper.findAllByText('Unlink twitch');
    const unlinkTwitchButton = await wrapper.findByTestId('unlinkTwitch');
    act(() => fireEvent.press(unlinkTwitchButton));
    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
      expect(axios.delete).toBeCalledWith(`${BASE_APP_API_URL}/users/me/twitch`);
    });
  });

  it('renders past broadcast when needed', async () => {
    const initialState = {
      currentUser: {
        ...mockCurrentUser,
        account: {
          ...mockCurrentUser.account,
          twitchAccount: {
            ...mockCurrentUser.account.twitchAccount,
            hasEnabledPastBroadcasts: false,
          },
        },
      },
    };
    jest.spyOn(axios, 'put').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    const callbackMock = jest.fn();
    const wrapper = reduxRender(<ConnectToTwitch callback={callbackMock} />, {initialState});
    await act(async () => fireEvent(await wrapper.findByTestId('confirm-past-broadcast'), 'onValueChange', true));
    await wrapper.findByText('Done');
    const doneButton = await wrapper.findByTestId('done-enabled');
    act(() => fireEvent.press(doneButton));
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toBeCalledWith(`${BASE_APP_API_URL}/users/me/twitch`, {
        hasEnabledPastBroadcasts: true,
      });
    });
    await waitFor(() => {
      expect(callbackMock).toHaveBeenCalledTimes(1);
    });
  });
});
