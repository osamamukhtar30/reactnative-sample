import React from 'react';
import {act, waitFor} from '@testing-library/react-native';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_APP_API_URL, BASE_PUBLIC_API_URL} from '@duelme/js-constants/dist/api';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';

import {server} from '../../common/tests/mockServer/server';

import {reduxRender} from './../../utils/tests/reduxRender';
import Home from './Home';

describe('Home', () => {
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

  it('renders home', async () => {
    const wrapper = reduxRender(<Home />, {});
    await wrapper.findByTestId('home');
  });

  it('renders all elements', async () => {
    const state = {
      currentUser: mockCurrentUser,
      games: mockGamesState,
      gameAccounts: mockGameAccountsState,
    };
    const wrapper = reduxRender(<Home />, {initialState: state});
    await wrapper.findByTestId('home');
    await wrapper.findByTestId('wallet-component');
    await wrapper.findByTestId('background-image');
    await wrapper.findByTestId('container-with-tabbar');
    await wrapper.findByTestId('game-card-container');
    // TODO: Multiple instances of the same component with different testID  are not working
    await wrapper.findByTestId('suggested-tournaments');
    // await wrapper.findByTestId('your-tournaments');
    // await wrapper.findByTestId('recent-tournaments');
    await wrapper.findByTestId('upcoming-matches');
    await wrapper.findByTestId('open-challenges');
    await wrapper.findByTestId('match-list');
    await wrapper.findByTestId('streams-carousel');
  });

  it('calls api', async () => {
    const state = {
      currentUser: mockCurrentUser,
      games: mockGamesState,
      gameAccounts: mockGameAccountsState,
    };
    const wrapper = reduxRender(<Home />, {initialState: state});

    const scrollView = await wrapper.findByTestId('home-scroll-view');
    jest.spyOn(axios, 'get');

    act(() => scrollView.props.refreshControl.props.onRefresh());

    await waitFor(() => {
      expect(axios.get).toBeCalledWith(`${BASE_PUBLIC_API_URL}/tournaments`);
      expect(axios.get).toBeCalledWith(`${BASE_PUBLIC_API_URL}/live-matches`);
      expect(axios.get).toBeCalledWith(`${BASE_APP_API_URL}/users/me/status`);
      expect(axios.get).toBeCalledWith(`${BASE_APP_API_URL}/quick/invite`);
      expect(axios.get).toBeCalledWith(`${BASE_APP_API_URL}/friendrequests`);
      expect(axios.get).toBeCalledWith(`${BASE_APP_API_URL}/pending-notifications`);
      expect(axios.get).toBeCalledWith(`${BASE_APP_API_URL}/matchmaking/open`, {params: {client: ''}});
    });
  });
});
