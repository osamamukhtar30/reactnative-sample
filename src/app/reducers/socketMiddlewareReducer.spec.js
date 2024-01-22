import React from 'react';
import {waitFor, act} from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import {MATCH_CHAT_MESSAGE, FRIEND_CHAT_MESSAGE} from '@duelme/js-constants/dist/chats';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import {MATCH_CREATION_ERROR} from '@duelme/js-constants/dist/matches';
import {FRIENDSHIP_REQUEST} from '@duelme/js-constants/dist/friends';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {QUICK_CHALLENGE_OFFER} from '@duelme/js-constants/dist/quickActions';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';

import {reduxRender} from '../../utils/tests/reduxRender';
import FunctionsForwarder from '../../components/FunctionsForwarder/FunctionsForwarder';

import socketMiddlewareReducer from './socketMiddlewareReducer';

describe('socketMiddlewareReducer', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const axios = AxiosService.getAxios();

  describe('MATCH_CHAT_MESSAGE', () => {
    it('shows toast message when new match chat is received and is not from current user', async () => {
      jest.spyOn(Toast, 'show');

      const initialState = {
        currentUser: mockCurrentUser,
      };
      const matchId = '20ab7bc2-a9b2-4019-92c0-1a9ed0539e00';

      const dispatchMock = jest.fn();

      socketMiddlewareReducer(initialState, {
        type: MATCH_CHAT_MESSAGE,
        payload: {
          message: {
            entityId: matchId,
            userId: 'testid',
            message: 'test message',
            accountName: 'testaccountname',
          },
        },
        dispatch: dispatchMock,
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'info',
          text1: 'test message',
          text2: 'testaccountname',
          onPress: expect.anything(),
        });
      });

      Toast.show.mock.calls[0][0].onPress();

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          payload: {
            params: {
              matchId: matchId,
            },
            screen: 'MatchChat',
          },
          type: 'asyncNavigator/navigateTo',
        });
      });
    });
    it('does not show toast message when new match chat is received and is from current user', async () => {
      jest.spyOn(Toast, 'show');

      const initialState = {
        currentUser: mockCurrentUser,
      };
      const matchId = '20ab7bc2-a9b2-4019-92c0-1a9ed0539e00';
      const dispatchMock = jest.fn();

      socketMiddlewareReducer(initialState, {
        type: MATCH_CHAT_MESSAGE,
        payload: {
          message: {
            entityId: matchId,
            userId: mockCurrentUser.account.id,
            message: 'test message',
            accountName: mockCurrentUser.account.username,
          },
        },
        dispatch: dispatchMock,
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('FRIEND_CHAT_MESSAGE', () => {
    it('shows toast message when new match chat is received and is not from current user', async () => {
      jest.spyOn(Toast, 'show');

      const initialState = {
        currentUser: mockCurrentUser,
      };
      const friendId = '20ab7bc2-a9b2-4019-92c0-1a9ed0539e00';

      const dispatchMock = jest.fn();

      socketMiddlewareReducer(initialState, {
        type: FRIEND_CHAT_MESSAGE,
        payload: {
          message: {
            entityId: friendId,
            userId: 'testid',
            message: 'test message',
            accountName: 'testaccountname',
          },
        },
        dispatch: dispatchMock,
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'info',
          text1: 'test message',
          text2: 'testaccountname',
          onPress: expect.anything(),
        });
      });

      Toast.show.mock.calls[0][0].onPress();

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
          payload: {
            screen: 'FriendsTab',
          },
          type: 'asyncNavigator/navigateTo',
        });
      });
    });

    it('does not show toast message when new match chat is received and is from current user', async () => {
      jest.spyOn(Toast, 'show');

      const initialState = {
        currentUser: mockCurrentUser,
      };
      const matchId = '20ab7bc2-a9b2-4019-92c0-1a9ed0539e00';
      const dispatchMock = jest.fn();

      socketMiddlewareReducer(initialState, {
        type: FRIEND_CHAT_MESSAGE,
        payload: {
          message: {
            entityId: matchId,
            userId: mockCurrentUser.account.id,
            message: 'test message',
            accountName: mockCurrentUser.account.username,
          },
        },
        dispatch: dispatchMock,
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('MATCH_CREATION_ERROR', () => {
    it('shows toast message on new match error', async () => {
      jest.spyOn(Toast, 'show');

      reduxRender(<FunctionsForwarder />, {});

      const initialState = {
        currentUser: mockCurrentUser,
      };

      const dispatchMock = jest.fn();

      act(() => {
        socketMiddlewareReducer(initialState, {
          type: MATCH_CREATION_ERROR,
          payload: {},
          dispatch: dispatchMock,
        });
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'error',
          text1: 'Match error',
          text2: 'There was an error creating the match',
        });
      });
    });
  });

  describe('FRIENDSHIP_REQUEST', () => {
    it('shows toast message when new friend request is received and calls API', async () => {
      jest.spyOn(Toast, 'show');
      jest.spyOn(Toast, 'hide');
      jest.spyOn(axios, 'delete').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {},
          }),
        ),
      );
      jest.spyOn(axios, 'put').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {},
          }),
        ),
      );

      reduxRender(<FunctionsForwarder />, {});

      const initialState = {
        currentUser: mockCurrentUser,
      };
      const friendShipId = '20ab7bc2-a9b2-4019-92c0-1a9ed0539e00';
      const dispatchMock = async fn => {
        await fn(jest.fn());
      };

      act(() => {
        socketMiddlewareReducer(initialState, {
          type: FRIENDSHIP_REQUEST,
          payload: {
            message: {
              friendship: {
                id: friendShipId,
                usernameFrom: 'testusernamefrom',
              },
            },
          },
          dispatch: dispatchMock,
        });
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'action',
          props: {
            text: 'Friend request from username testusernamefrom',
            actionOneText: 'Accept',
            actionTwoText: 'Reject',
            actionOne: expect.anything(),
            actionTwo: expect.anything(),
          },
        });
      });

      act(() => Toast.show.mock.calls[0][0].props.actionOne());

      await waitFor(() => {
        expect(Toast.hide).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toBeCalledWith(`${BASE_APP_API_URL}/friendrequests/${friendShipId}`);
      });

      act(() => Toast.show.mock.calls[0][0].props.actionTwo());

      await waitFor(() => {
        expect(Toast.hide).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.delete).toBeCalledWith(`${BASE_APP_API_URL}/friendrequests/${friendShipId}`);
      });
    });
  });

  describe('QUICK_CHALLENGE_OFFER', () => {
    it('shows toast message when new challenge is received and calls API', async () => {
      jest.spyOn(Toast, 'show');
      jest.spyOn(Toast, 'hide');
      jest.spyOn(axios, 'delete').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {},
          }),
        ),
      );
      jest.spyOn(axios, 'put').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {},
          }),
        ),
      );

      const initialState = {
        currentUser: mockCurrentUser,
        gameAccounts: mockGameAccountsState,
        games: mockGamesState,
      };

      reduxRender(<FunctionsForwarder />, {initialState});

      const invitationId = '20ab7bc2-a9b2-4019-92c0-1a9ed0539e00';
      const dispatchMock = async fn => {
        await fn(jest.fn());
      };

      act(() => {
        socketMiddlewareReducer(initialState, {
          type: QUICK_CHALLENGE_OFFER,
          payload: {
            message: {
              quickChallenge: {
                id: invitationId,
                usernameFrom: 'testusernamefrom',
                gameId: '1',
                amount: 5,
              },
            },
          },
          dispatch: dispatchMock,
        });
      });

      await waitFor(() => {
        expect(Toast.show).toHaveBeenCalledTimes(1);
        expect(Toast.show).toBeCalledWith({
          type: 'action',
          visibilityTime: 30000,
          props: {
            text: '$5 League of Legends challenge from testusernamefrom',
            actionOneText: 'Accept',
            actionTwoText: 'Reject',
            actionOne: expect.anything(),
            actionTwo: expect.anything(),
          },
        });
      });

      act(() => Toast.show.mock.calls[0][0].props.actionOne());

      await waitFor(() => {
        expect(Toast.hide).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledTimes(1);
        expect(axios.put).toBeCalledWith(`${BASE_APP_API_URL}/quick/challenge/${invitationId}`, {
          useExternalWallet: false,
        });
      });

      act(() => Toast.show.mock.calls[0][0].props.actionTwo());

      await waitFor(() => {
        expect(Toast.hide).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledTimes(1);
        expect(axios.delete).toBeCalledWith(`${BASE_APP_API_URL}/quick/invite/${invitationId}`);
      });
    });
  });
});
