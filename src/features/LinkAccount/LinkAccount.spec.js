jest.useFakeTimers();
import React from 'react';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {mockGameAccountsState} from '@duelme/testing-library/dist/factories/gameAccounts';

import {server} from '../../common/tests/mockServer/server';
import {reduxRender} from '../../utils/tests/reduxRender';

import LinkAccount from './LinkAccount';

describe('LinkAccount', () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  it('renders container', async () => {
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: {
        ...mockGamesState,
        selectedGameId: mockGamesState.entities[mockGamesState.ids[0]].id,
      },
    };
    const wrapper = reduxRender(<LinkAccount />, {initialState});
    await wrapper.findByTestId('container');
  });

  it('renders correct text', async () => {
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: {
        ...mockGamesState,
        selectedGameId: mockGamesState.entities[mockGamesState.ids[0]].id,
      },
    };
    const wrapper = reduxRender(<LinkAccount />, {initialState});
    expect(await wrapper.queryAllByText('Connect your')).not.toBeNull();
    await wrapper.findByText('account');
  });

  it('renders link account form', async () => {
    const initialState = {
      currentUser: mockCurrentUser,
      gameAccounts: mockGameAccountsState,
      games: {
        ...mockGamesState,
        selectedGameId: mockGamesState.entities[mockGamesState.ids[0]].id,
      },
    };
    const wrapper = reduxRender(<LinkAccount />, {initialState});
    await wrapper.findByTestId('link-account-form');
  });
});
