import React from 'react';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {fireEvent, waitFor, act} from '@testing-library/react-native';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import * as modal from '@duelme/apisdk/dist/slices/modal/native';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {PLATFORM_TYPE_CONSOLE} from '@duelme/js-constants/dist/games';

import {reduxRender} from '../../utils/tests/reduxRender';
import {server} from '../../common/tests/mockServer/server';
import {mockedGoBack, mockedNavigate} from '../../../jest.setup';

import GameMode from './GameMode';

describe('GameMode', () => {
  beforeAll(() => server.listen());
  beforeEach(() => jest.clearAllMocks());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  const axios = AxiosService.getAxios();

  const initialState = {
    gameAccounts: mockGameAccountsState,
    currentUser: {
      ...mockCurrentUser,
    },
    games: {
      ...mockGamesState,
      selectedGameId: '1',
    },
  };

  const matchType = {
    id: '1',
    name: 'LOL_1VS1_HOWLING_ABYSS',
  };
  const prizePool = '10';
  const entryFee = '5';
  const crossPlayEnabled = true;
  const route = {
    params: {
      matchType,
      prizePool,
      entryFee,
      crossPlayEnabled,
    },
  };

  it('renders test id', async () => {
    const wrapper = reduxRender(<GameMode route={route} />, {initialState});
    await wrapper.findByTestId('game-mode');
  });

  it('renders data about matchmaking', async () => {
    const wrapper = reduxRender(<GameMode route={route} />, {initialState});
    await wrapper.findByText('Map');
    const mapInput = await wrapper.findByTestId('map-value');
    expect(mapInput.props.value).toEqual('Howling Abyss');

    await wrapper.findByText('Game Type');
    const gameTypeInput = await wrapper.findByTestId('gameType-value');
    expect(gameTypeInput.props.value).toEqual('Blind Pick');

    await wrapper.findByText('Game Mode');
    const gameModeInput = await wrapper.findByTestId('gameMode-value');
    expect(gameModeInput.props.value).toEqual('1v1');

    await wrapper.findByText('Prize Pool');
    const prizePoolInput = await wrapper.findByTestId('prize_pool-value');
    expect(prizePoolInput.props.value).toEqual('10');

    await wrapper.findByText('Region');
    const regionInput = await wrapper.findByTestId('region-value');
    expect(regionInput.props.value).toEqual('NA1 (North America)');
  });

  it('renders cancel button and handle press', async () => {
    const wrapper = reduxRender(<GameMode route={route} />, {initialState});
    const cancelButton = await wrapper.findByText('Cancel');
    act(() => fireEvent.press(cancelButton));

    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('continue button', () => {
    it('opens rules if rules not accepted', async () => {
      const openModalMock = jest.spyOn(modal, 'openModal');
      const wrapper = reduxRender(<GameMode route={route} />, {initialState});
      const findMatch = await wrapper.findByText('Find match');
      act(() => fireEvent.press(findMatch));

      await waitFor(() => {
        expect(openModalMock).toBeCalledWith('rules', {
          resolve: expect.anything(),
          feature: 'matchmaking',
        });
      });
    });

    it('calls api to get into matchmaking queue', async () => {
      const wrapper = reduxRender(<GameMode route={route} />, {
        initialState: {
          ...initialState,
          tutorial: {
            statuses: {
              matchmakingRules: true,
            },
          },
        },
      });
      const findMatch = await wrapper.findByText('Find match');
      jest.spyOn(axios, 'post').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {},
          }),
        ),
      );
      jest.spyOn(axios, 'get').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {},
          }),
        ),
      );

      act(() => fireEvent.press(findMatch));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`${BASE_APP_API_URL}/matchmaking/find`, {
          bet: {
            amount: entryFee,
            currency: 'USD',
          },
          crossPlayEnabled: true,
          gameAccountId: '1',
          matchTypeId: '1',
          useExternalWallet: false,
        });
      });

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`${BASE_APP_API_URL}/matchmaking/recommendation`, {
          params: {
            amount: entryFee,
            currency: 'USD',
            gameId: '1',
            matchTypeId: '1',
            platformName: 'PC',
            platformType: 'PC',
            regionId: '1',
          },
        });
      });
    });

    it('handles error when getting into matchmaking queue', async () => {
      jest.spyOn(axios, 'post').mockReturnValue(new Promise((resolve, reject) => reject()));
      const wrapper = reduxRender(<GameMode route={route} />, {
        initialState: {
          ...initialState,
          tutorial: {
            statuses: {
              matchmakingRules: true,
            },
          },
        },
      });

      await act(async () => fireEvent.press(await wrapper.findByText('Find match')));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(axios.post).toHaveBeenCalledWith(`${BASE_APP_API_URL}/matchmaking/find`, {
          bet: {
            amount: entryFee,
            currency: 'USD',
          },
          crossPlayEnabled: true,
          gameAccountId: '1',
          matchTypeId: '1',
          useExternalWallet: false,
        });
      });

      await waitFor(() => {
        expect(mockedNavigate).toBeCalledWith('Matchmaking');
      });
    });

    it('opens link account if no game account for selected game', async () => {
      const wrapper = reduxRender(<GameMode route={route} />, {
        initialState: {
          ...initialState,
          gameAccounts: {
            ids: [],
            entities: {},
          },
          tutorial: {
            statuses: {
              matchmakingRules: true,
            },
          },
        },
      });

      await act(async () => fireEvent.press(await wrapper.findByText('Find match')));

      await waitFor(() => {
        expect(mockedNavigate).toBeCalledWith('LinkAccount', {gameId: '1', matchmakingMode: true});
      });
    });

    it('opens link twitch account if platform type is console and there is no twitch account', async () => {
      const wrapper = reduxRender(<GameMode route={route} />, {
        initialState: {
          ...initialState,
          gameAccounts: {
            ids: mockGameAccountsState.ids,
            entities: {
              ...mockGameAccountsState.entities,
              1: {
                ...mockGameAccountsState.entities['1'],
                platformType: PLATFORM_TYPE_CONSOLE,
              },
            },
          },
          tutorial: {
            statuses: {
              matchmakingRules: true,
            },
          },
        },
      });

      await act(async () => fireEvent.press(await wrapper.findByText('Find match')));

      await waitFor(() => {
        expect(mockedNavigate).toBeCalledWith('ConnectToTwitch');
      });
    });

    it('calls api if stream required and twitch account connected', async () => {
      const wrapper = reduxRender(<GameMode route={route} />, {
        initialState: {
          ...initialState,
          gameAccounts: {
            ids: mockGameAccountsState.ids,
            entities: {
              ...mockGameAccountsState.entities,
              1: {
                ...mockGameAccountsState.entities['1'],
                platformType: PLATFORM_TYPE_CONSOLE,
              },
            },
          },
          currentUser: {
            ...mockCurrentUser,
            account: {
              ...mockCurrentUser.account,
              twitchAccount: {
                hasEnabledPastBroadcasts: true,
              },
            },
          },
          tutorial: {
            statuses: {
              matchmakingRules: true,
            },
          },
        },
      });
      await wrapper.findByText('Find match');
    });
  });
});
