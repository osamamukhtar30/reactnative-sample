import React from 'react';
import {rest} from 'msw';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {expect} from '@jest/globals';
import {act, fireEvent, waitFor} from '@testing-library/react-native';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {friendFactory} from '@duelme/testing-library/dist/factories/friends';

import {reduxRender} from '../../../utils/tests/reduxRender';
import {server} from '../../../common/tests/mockServer/server';

import FindPlayer from './FindPlayer';

describe('Find Player', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  const axios = AxiosService.getAxios();

  describe('Search', () => {
    it('it renders friends rows after search', async () => {
      jest.mock('lodash/debounce', () =>
        jest.fn(fn => {
          fn.cancel = jest.fn();
          return fn;
        }),
      );
      const username = 'user1';
      server.use(
        rest.get(`${BASE_APP_API_URL}/friendsearch`, (req, res, ctx) => {
          return res.once(ctx.json([friendFactory.build({username})]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<FindPlayer />, {});
      const textInput = await wrapper.findByTestId('text-input');
      await act(async () => {
        await fireEvent.changeText(textInput, username);
      });

      await waitFor(async () => await wrapper.findByTestId('friend-item'), {timeout: 5000}); //have to wait for timout due to debounce calling function late
    });
    it('it renders correct user name after search which was searched', async () => {
      jest.mock('lodash/debounce', () =>
        jest.fn(fn => {
          fn.cancel = jest.fn();
          return fn;
        }),
      );
      const username = 'user1';
      server.use(
        rest.get(`${BASE_APP_API_URL}/friendsearch`, (req, res, ctx) => {
          return res.once(ctx.json([friendFactory.build({username})]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<FindPlayer />, {});
      const textInput = await wrapper.findByTestId('text-input');
      await act(async () => {
        await fireEvent.changeText(textInput, username);
      });

      await waitFor(async () => await wrapper.findByText(username), {timeout: 5000}); //have to wait for timout due to debounce calling function late
    });
    it('it calls search API with correct params after search', async () => {
      const findFriendsThunk = jest.spyOn(axios, 'get');
      jest.mock('lodash/debounce', () =>
        jest.fn(fn => {
          fn.cancel = jest.fn();
          return fn;
        }),
      );
      const username = 'user1';
      server.use(
        rest.get(`${BASE_APP_API_URL}/friendsearch`, (req, res, ctx) => {
          return res.once(ctx.json([friendFactory.build({username})]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<FindPlayer />, {});
      const textInput = await wrapper.findByTestId('text-input');
      await act(async () => {
        await fireEvent.changeText(textInput, username);
      });

      await waitFor(
        () => expect(findFriendsThunk).toBeCalledWith(`${BASE_APP_API_URL}/friendsearch?usernameQuery=user1`), //have to wait for timout due to debounce calling function late
        {timeout: 5000},
      );
    });
  });
  describe('Add friend', () => {
    it('it calls add friend api on pressing add friend button', async () => {
      const user = friendFactory.build({username: 'user1'});
      const friendRequestThunk = jest.spyOn(axios, 'post').mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: user,
          }),
        ),
      );
      jest.mock('lodash/debounce', () =>
        jest.fn(fn => {
          fn.cancel = jest.fn();
          return fn;
        }),
      );
      server.use(
        rest.get(`${BASE_APP_API_URL}/friendsearch`, (req, res, ctx) => {
          return res.once(ctx.json([user]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<FindPlayer />, {});
      const textInput = await wrapper.findByTestId('text-input');
      await act(async () => {
        await fireEvent.changeText(textInput, user.username);
      });

      await waitFor(async () => await wrapper.findByTestId('friend-item'), {timeout: 5000}); //have to wait for timout due to debounce calling function late
      const requestButton = await wrapper.findByTestId('send-request-button');
      await act(async () => {
        await fireEvent.press(requestButton);
      });

      expect(friendRequestThunk).toBeCalledWith(`${BASE_APP_API_URL}/friendrequests`, {userIdTo: user.id});
    });
  });
});
