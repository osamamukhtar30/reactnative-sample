import React from 'react';
import moment from 'moment';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {fireEvent, waitFor, act} from '@testing-library/react-native';
import {USER_STATUS_BANNED, USER_STATUS_PERMABAN} from '@duelme/js-constants/dist/userStatus';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import Toast from 'react-native-toast-message';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';
import {tournamentFactory} from '@duelme/testing-library/dist/factories/tournaments';
import {matchFactory} from '@duelme/testing-library/dist/factories/matches';
import * as modal from '@duelme/apisdk/dist/slices/modal/native';
import * as walletsHooks from '@duelme/apisdk/dist/hooks/wallets';

import {mockedNavigate} from '../../../jest.setup';
import {reduxRender} from '../../utils/tests/reduxRender';
import {server} from '../../common/tests/mockServer/server';

import {useCanPlayMatchApp} from './matches';

const mockMatchFunction = jest.fn();

const mockCallback = jest.fn();

const TestComponent = ({gameId, amount, isJoiningTournament = false, startTime = null}) => {
  const navigation = useNavigation();
  const canPlayMatchApp = useCanPlayMatchApp(gameId, navigation);

  return (
    <TouchableOpacity
      testID="send"
      onPress={() => {
        canPlayMatchApp({amount, isJoiningTournament, startTime}, mockMatchFunction, mockCallback);
      }}
    />
  );
};

describe('useCanPlayMatchApp', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  jest.spyOn(Toast, 'show');

  describe('high priority', () => {
    it('tax verification required', async () => {
      // 1099_REQUIRED
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            requires1099: true,
            nextform1099Approved: false,
          },
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: '1099 form is required',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('account not verified', async () => {
      // ACCOUNT_NOT_VERIFIED
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            accountVerified: false,
            requiresVerification: true,
          },
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'Your account is not verified',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('user banned', async () => {
      // USER_BANNED
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          status: {
            active: USER_STATUS_BANNED,
          },
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'You are banned',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('user permanentyl banned', async () => {
      // USER_BANNED
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          status: {
            active: USER_STATUS_PERMABAN,
          },
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'You are banned',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('user in a match', async () => {
      // IN_A_MATCH
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          status: {
            active: 'matches',
          },
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'You are in a match',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('user in a tournament', async () => {
      // IN_A_TOURNAMENT
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          status: {
            active: 'tournaments',
          },
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'You are in a tournament',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('medium priority', () => {
    it('no game account for selected game', async () => {
      // NO_GAME_ACCOUNT
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
        },
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedNavigate).toBeCalledWith('SettingsLinkAccount', {gameId: '1', matchmakingMode: false});
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('no game account for selected game', async () => {
      // CONNECT_TO_TWITCH
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            twitchAccount: null,
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(<TestComponent gameId={'3'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));
      await waitFor(() => {
        expect(mockedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedNavigate).toBeCalledWith('ConnectToTwitch');
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });

    it('tournament about to start', async () => {
      // TOURNAMENT_ABOUT_TO_START
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            incomingTournaments: [
              tournamentFactory.build({
                startDate: moment().add(10, 'minutes').format(),
              }),
            ],
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));

      // The confirmation modal is triggered
      await wrapper.findByText(
        'You have a tournament starting in less than 15 minutes. Are you sure you want to continue?',
      );
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(0);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });

      const continueButton = await wrapper.findByText('continue');
      act(() => fireEvent.press(continueButton));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(1);
      });
    });

    it('scheduled match about to start', async () => {
      // SCHEDULE_MATCH_ABOUT_TO_START
      const scheduledMatch = matchFactory.build({
        startTime: moment().add(10, 'minutes').format(),
      });
      scheduledMatch.me = true;

      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
          },
        },
        scheduledMatches: {
          ids: [scheduledMatch.id],
          entities: {
            [scheduledMatch.id]: scheduledMatch,
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));

      // The confirmation modal is triggered
      await wrapper.findByText(
        'You have a scheduled match starting in less than 15 minutes. Are you sure you want to continue?',
      );
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(0);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });

      const continueButton = await wrapper.findByText('continue');
      act(() => fireEvent.press(continueButton));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(1);
      });
    });

    it('tournament about to start around given time', async () => {
      // TOURNAMENT_STARTING_AROUND_GIVEN_TIME
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            incomingTournaments: [
              tournamentFactory.build({
                startDate: moment().add(120, 'minutes').format(),
              }),
            ],
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(
        <TestComponent
          gameId={'1'}
          amount={5}
          isJoiningTournament={true}
          startTime={moment().add(120, 'minutes').format()}
        />,
        {initialState},
      );
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));

      // The confirmation modal is triggered
      await wrapper.findByText('You have a tournament starting around given time. Are you sure you want to continue?');
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(0);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });

      const continueButton = await wrapper.findByText('continue');
      act(() => fireEvent.press(continueButton));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(1);
      });
    });

    it('no past videos in twitch', async () => {
      // ENABLE_PAST_BROADCASTS

      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            twitchAccount: {
              hasEnabledPastBroadcasts: true,
            },
          },
          streams: {
            ids: [],
            entities: {},
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(<TestComponent gameId={'3'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));

      // The confirmation modal is triggered
      await wrapper.findByText(
        'We did not find any past broadcasts. Please ensure you have enabled past broadcasts. If this is your first time playing, this is expected behavior and you can continue',
      );
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(0);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });

      const continueButton = await wrapper.findByText('continue');
      act(() => fireEvent.press(continueButton));

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(1);
      });
    });

    it('insufficient funds', async () => {
      // INSUFFICIENT_FUNDS
      const openModalMock = jest.spyOn(modal, 'openModal');
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            twitchAccount: {
              hasEnabledPastBroadcasts: true,
            },
          },
          wallets: {
            ...mockCurrentUser.wallets,
            entities: {
              USD: {
                ...mockCurrentUser.wallets.entities.USD,
                balance: 0,
                bonus: 0,
              },
            },
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'You do not have enough funds',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
      await waitFor(() => {
        expect(openModalMock).toHaveBeenCalledTimes(1);
        expect(openModalMock).toBeCalledWith('deposit');
      });
    });
  });

  describe('low priority', () => {
    it('not expected error', async () => {
      jest.spyOn(walletsHooks, 'useIsExternalWallet').mockReturnValue(() => {
        throw 'Custom error';
      });
      const initialState = {
        currentUser: {
          ...mockCurrentUser,
          account: {
            ...mockCurrentUser.account,
            twitchAccount: {
              hasEnabledPastBroadcasts: true,
            },
          },
          wallets: {
            ...mockCurrentUser.wallets,
            entities: {
              USD: {
                ...mockCurrentUser.wallets.entities.USD,
                balance: 0,
                bonus: 0,
              },
            },
          },
        },
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      const wrapper = reduxRender(<TestComponent gameId={'1'} amount={5} />, {initialState});
      const sendButton = await wrapper.findByTestId('send');
      act(() => fireEvent.press(sendButton));

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'Custom error',
        });
      });
      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1);
      });
      await waitFor(() => {
        expect(mockMatchFunction).toHaveBeenCalledTimes(0);
      });
    });
  });
});
