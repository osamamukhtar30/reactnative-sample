/**
 * @format
 */
jest.useFakeTimers();
import React from 'react';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {rest} from 'msw';

import {reduxRender} from '../../utils/tests/reduxRender';
import {server} from '../../common/tests/mockServer/server';

import FriendsTab from './FriendsTab';

describe('FriendsTab', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());
  it('renders social tab if no initial tab is passed as param', async () => {
    server.use(
      rest.get(`${BASE_APP_API_URL}/quick/statuses`, (req, res, ctx) => {
        return res.once(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
      }),
    );
    const wrapper = reduxRender(<FriendsTab route={{params: {initialTab: undefined}}} />, {
      initialState: {},
    });
    await wrapper.findByTestId('social');
  });

  it('renders FindPlayer tab if  initial tab is passed as param', async () => {
    const wrapper = reduxRender(<FriendsTab route={{params: {initialTab: 1}}} />, {
      initialState: {},
    });
    await wrapper.findByTestId('find-player');
  });

  it('renders Requests tab if  initial tab is passed as param', async () => {
    const wrapper = reduxRender(<FriendsTab route={{params: {initialTab: 2}}} />, {
      initialState: {},
    });
    await wrapper.findByTestId('requests');
  });
});
