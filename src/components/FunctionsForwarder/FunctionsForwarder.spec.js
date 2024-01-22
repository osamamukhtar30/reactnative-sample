import React from 'react';
import {waitFor, act} from '@testing-library/react-native';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';

import {server} from '../../common/tests/mockServer/server';

import {reduxRender} from './../../utils/tests/reduxRender';
import FunctionsForwarder, {reference} from './FunctionsForwarder';

describe('FunctionsForwarder', () => {
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

  it('translates correctly', async () => {
    reduxRender(<FunctionsForwarder />, {
      initialState: {},
    });
    const translated = reference.translate({key: 'must_be_a_valid_url'});
    expect(translated).toEqual('Must be a valid URL');
  });

  it('calls accept quick challenge', async () => {
    jest.spyOn(axios, 'put').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );

    reduxRender(<FunctionsForwarder />, {
      initialState: {
        currentUser: mockCurrentUser,
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      },
    });

    act(() =>
      reference.handleAcceptChallenge({
        challenge: {
          id: 1,
          amount: 5,
          gameId: '1',
        },
      }),
    );

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toBeCalledWith(`${BASE_APP_API_URL}/quick/challenge/${1}`, {
        useExternalWallet: false,
      });
    });
  });
});
