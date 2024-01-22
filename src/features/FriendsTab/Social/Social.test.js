import React from 'react';
import {rest} from 'msw';
import {BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import {expect} from '@jest/globals';
import {fireEvent} from '@testing-library/react-native';
import {Share} from 'react-native';

import {reduxRender} from '../../../../src/utils/tests/reduxRender';
import {server} from '../../../../src/common/tests/mockServer/server';
import Social from '../../../../src/features/FriendsTab/Social/Social';
import {mockedNavigate} from '../../../../jest.setup';

describe('Social', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  describe('Empty State', () => {
    it('it renders empty state renders correctly if no data is available', async () => {
      server.use(
        rest.get(`${BASE_APP_API_URL}/quick/statuses`, (req, res, ctx) => {
          return res.once(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<Social />, {});
      await wrapper.findByText("You don't have");
      await wrapper.findByText('friends yet');
      await wrapper.findByText('Your friends will be listed here');
      await wrapper.findByTestId('invite-button');
      await wrapper.findByTestId('find-button');
    });
    it('it redirects correctly to Find Player on find button press', async () => {
      server.use(
        rest.get(`${BASE_APP_API_URL}/quick/statuses`, (req, res, ctx) => {
          return res.once(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<Social />, {});
      const findButton = await wrapper.findByTestId('find-button');
      fireEvent.press(findButton);
      expect(mockedNavigate).toBeCalledWith('FindPlayer');
    });
    it('it calls native share api on invite button press', async () => {
      const shareSpy = jest.spyOn(Share, 'share');
      server.use(
        rest.get(`${BASE_APP_API_URL}/quick/statuses`, (req, res, ctx) => {
          return res.once(ctx.json([]), ctx.set('Access-Control-Allow-Origin', '*'));
        }),
      );
      const wrapper = reduxRender(<Social />, {});
      const inviteButton = await wrapper.findByTestId('invite-button');
      fireEvent.press(inviteButton);
      expect(shareSpy).toBeCalled();
    });
    it("it doesn't render empty state if data is available", async () => {
      const wrapper = reduxRender(<Social />, {});
      let result = wrapper.queryByText("You don't have");
      expect(result).toBeNull();
      result = wrapper.queryByText('friends yet');
      expect(result).toBeNull();
      result = wrapper.queryByText('Your friends will be listed here');
      expect(result).toBeNull();
      result = wrapper.queryByText('invite-button');
      expect(result).toBeNull();
      result = wrapper.queryByText('find-button');
      expect(result).toBeNull();
      await wrapper.findByTestId('friends-list');
    });
  });

  describe('Users rows are rending', () => {
    it('it renders correct number of Friends in list', async () => {
      const wrapper = reduxRender(<Social />, {});
      const friends = await wrapper.findAllByTestId('friend-item');
      expect(friends.length).toBe(2);
    });
    it('it makes sure username is correct', async () => {
      const wrapper = reduxRender(<Social />, {});
      const userNames = await wrapper.findAllByText('user2');
      expect(userNames.length).toBeGreaterThanOrEqual(1);
    });
    it('it makes sure online status is correct', async () => {
      const wrapper = reduxRender(<Social />, {});
      const onlineStatus = await wrapper.findAllByText('Online');
      expect(onlineStatus.length).toBe(1); //1 user is offline
    });
  });
});
