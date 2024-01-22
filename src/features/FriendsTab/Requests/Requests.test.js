import React from 'react';
import {rest} from 'msw';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {expect} from '@jest/globals';
import {mockCurrentUser} from '@duelme/testing-library/dist/factories/currentUser';
import {act, fireEvent, waitFor} from '@testing-library/react-native';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';

import {reduxRender} from '../../../utils/tests/reduxRender';
import {server} from '../../../common/tests/mockServer/server';
import Requests from '../Requests/Requests';

describe('Requests', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  const axios = AxiosService.getAxios();

  describe('Empty State', () => {
    it('it renders empty state renders correctly if no data is available', async () => {
      server.use(
        rest.get(`${BASE_APP_API_URL}/friendrequests`, (req, res, ctx) => {
          return res.once(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<Requests />, {initialState: {currentUser: mockCurrentUser}});
      await wrapper.findByText("You don't have");
      await wrapper.findByText('friends requests');
      await wrapper.findByText('Friend requests will be listed here');
    });

    it("it doesn't render empty state if data is available", async () => {
      const wrapper = reduxRender(<Requests />, {initialState: {currentUser: mockCurrentUser}});

      await waitFor(() => expect(wrapper.queryByText("You don't have")).toBeNull());
      await waitFor(() => expect(wrapper.queryByText('friends requests')).toBeNull());
      await waitFor(() => expect(wrapper.queryByText('Friend requests will be listed here')).toBeNull());
    });
  });

  describe('friends rows are rending', () => {
    it('it renders correct number of request in list', async () => {
      const wrapper = reduxRender(<Requests />, {initialState: {currentUser: mockCurrentUser}});
      const friends = await wrapper.findAllByTestId('friend-item');
      expect(friends.length).toBe(1);
    });
    it('it makes sure username is correct', async () => {
      const wrapper = reduxRender(<Requests />, {initialState: {currentUser: mockCurrentUser}});
      const userNames = await wrapper.findAllByText('user2');
      expect(userNames.length).toBe(1);
    });
  });
  describe('Request actions', () => {
    it('it calls accept api if accept button is pressed', async () => {
      const putSpy = jest.spyOn(axios, 'put');
      const wrapper = reduxRender(<Requests />, {initialState: {currentUser: mockCurrentUser}});
      const acceptButton = await wrapper.findByTestId('accept-button');
      await act(async () => {
        await fireEvent.press(acceptButton);
      });

      expect(putSpy).toBeCalledWith(`${BASE_APP_API_URL}/friendrequests/59680389-7cde-4363-8035-68ba072fe99a`);
    });
    it('it calls reject api if reject button is pressed', async () => {
      const deleteSpy = jest.spyOn(axios, 'delete').mockReturnValue(new Promise(resolve => resolve({})));
      const wrapper = reduxRender(<Requests />, {initialState: {currentUser: mockCurrentUser}});
      const acceptButton = await wrapper.findByTestId('reject-button');
      await act(async () => {
        await fireEvent.press(acceptButton);
      });
      expect(deleteSpy).toBeCalledWith(`${BASE_APP_API_URL}/friendrequests/59680389-7cde-4363-8035-68ba072fe99a`);
      expect(await wrapper.queryByTestId('loading')).toBeNull();
      expect(await wrapper.queryByTestId('reject-button')).toBeNull();
    });
  });
});
