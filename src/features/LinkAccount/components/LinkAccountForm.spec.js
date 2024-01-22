jest.useFakeTimers();
import React from 'react';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';
import {fireEvent, waitFor, act} from '@testing-library/react-native';
import * as modalSlice from '@duelme/apisdk/dist/slices/modal/native';

import {mockedNavigate, mockedGoBack, mockedNavigationDispatch} from '../../../../jest.setup';
import {server} from '../../../common/tests/mockServer/server';
import {reduxRender} from '../../../utils/tests/reduxRender';

import LinkAccountForm from './LinkAccountForm';

describe('LinkAccountForm', () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  const axios = AxiosService.getAxios();

  it('renders link-account-form', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    await wrapper.findByTestId('link-account-form');
  });

  it('renders correct texts', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    await wrapper.findByText('Account name');
    await wrapper.findByText('Region');
    await wrapper.findByText('Link account');
  });

  it('shows disabled button if account name is empty', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    await wrapper.findByTestId('button-disabled');
  });

  it('does not call API if clicking cancel in warning', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    await wrapper.findByText('Account name');
    await wrapper.findByText('Region');
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const cancelButton = await wrapper.findByText('Cancel');
    act(() => fireEvent.press(cancelButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  it('calls API if clicking accept in warning', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${BASE_APP_API_URL}/game-accounts`, {
        accountName: accountName,
        gameId: gameId,
        platformName: 'PC',
        regionId: '1',
      });
    });
  });

  it('calls API if clicking updating account', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'put').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const gameAccount = mockGameAccountsState.entities[mockGameAccountsState.ids[0]];
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} gameAccount={gameAccount} />, {initialState});
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toBeCalledWith(`${BASE_APP_API_URL}/game-accounts/${gameAccount.id}`, {
        accountName: accountName,
        platformName: 'PC',
        regionId: '1',
      });
    });
    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalledTimes(1);
    });
  });

  it('goes back when user skip disabled and not matchmaking', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} disabledSkip={true} />, {initialState});
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${BASE_APP_API_URL}/game-accounts`, {
        accountName: accountName,
        gameId: gameId,
        platformName: 'PC',
        regionId: '1',
      });
    });
    await waitFor(() => {
      expect(mockedGoBack).toHaveBeenCalledTimes(1);
    });
  });

  it('pops to top when user skip disabled and matchmaking', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} disabledSkip={true} matchmakingMode={true} />, {
      initialState,
    });
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${BASE_APP_API_URL}/game-accounts`, {
        accountName: accountName,
        gameId: gameId,
        platformName: 'PC',
        regionId: '1',
      });
    });
    await waitFor(() => {
      expect(mockedNavigationDispatch).toHaveBeenCalledTimes(1);
      expect(mockedNavigationDispatch).toBeCalledWith({type: 'POP_TO_TOP'});
    });
  });

  it('navigates to avatar creation when user have not avatar created', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${BASE_APP_API_URL}/game-accounts`, {
        accountName: accountName,
        gameId: gameId,
        platformName: 'PC',
        regionId: '1',
      });
    });
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toBeCalledWith('AvatarCreation');
    });
  });

  it('navigates to drawer creation when user have an avatar created', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: {
        ...mockCurrentUser,
        account: {
          ...mockCurrentUser.account,
          hasSavedAvatar: true,
        },
      },
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    const accountNameInput = await wrapper.findByTestId('accountName');
    const accountName = 'testingname';
    act(() => fireEvent.changeText(accountNameInput, accountName));
    const linkAccountButton = await wrapper.findByTestId('button-enabled');
    act(() => fireEvent.press(linkAccountButton));
    await wrapper.findByText('An incorrect name will result in the loss of the games played. Do you want to continue?');
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(modalSlice.closeModal).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toBeCalledWith(`${BASE_APP_API_URL}/game-accounts`, {
        accountName: accountName,
        gameId: gameId,
        platformName: 'PC',
        regionId: '1',
      });
    });
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toBeCalledWith('DrawerNavigator');
    });
  });

  it('navigates to avatar creation when user skips and have not an avatar created', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: {
        ...mockCurrentUser,
        account: {
          ...mockCurrentUser.account,
          hasSavedAvatar: false,
        },
      },
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    const skipButton = await wrapper.findByText('Skip');
    act(() => fireEvent.press(skipButton));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toBeCalledWith('AvatarCreation');
    });
  });

  it('navigates to drawer when user skips and have an avatar created', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: {
        ...mockCurrentUser,
        account: {
          ...mockCurrentUser.account,
          hasSavedAvatar: true,
        },
      },
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} />, {initialState});
    const skipButton = await wrapper.findByText('Skip');
    act(() => fireEvent.press(skipButton));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toBeCalledWith('DrawerNavigator');
    });
  });

  it('does not show skip if disabled', async () => {
    const gameId = mockGamesState.entities[mockGamesState.ids[0]].id;
    const initialState = {
      currentUser: {
        ...mockCurrentUser,
        account: {
          ...mockCurrentUser.account,
          hasSavedAvatar: true,
        },
      },
      gameAccounts: mockGameAccountsState,
      games: mockGamesState,
    };
    jest.spyOn(axios, 'post').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {},
        }),
      ),
    );
    jest.spyOn(modalSlice, 'closeModal');
    const wrapper = reduxRender(<LinkAccountForm gameId={gameId} disabledSkip={true} />, {initialState});
    expect(await wrapper.queryByText('Skip')).toBeNull();
  });
});
