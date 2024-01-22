import React from 'react';
import {fireEvent, act, waitFor} from '@testing-library/react-native';

import {server} from '../../common/tests/mockServer/server';

import {mockedPop} from './../../../jest.setup';
import {reduxRender} from './../../utils/tests/reduxRender';
import ConnectToTwitch from './ConnectToTwitch';

describe('ConnectToTwitch', () => {
  beforeAll(() => {
    server.listen();
    jest.useFakeTimers();
  });
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  it('renders connect-to-twitch-feature', async () => {
    const wrapper = reduxRender(<ConnectToTwitch />, {});
    await wrapper.findByTestId('connect-to-twitch-feature');
  });

  it('navigates back if back arrow is clicked', async () => {
    const wrapper = reduxRender(<ConnectToTwitch />, {});
    const backArrow = await wrapper.findByTestId('back-arrow');
    act(() => {
      fireEvent.press(backArrow);
    });
    await waitFor(() => {
      expect(mockedPop).toHaveBeenCalledTimes(1);
    });
  });

  it('renders connect to twitch component', async () => {
    const wrapper = reduxRender(<ConnectToTwitch />, {});
    const connectToTwitchComponent = await wrapper.findByTestId('connect-to-twitch-component');
    connectToTwitchComponent;
    expect(connectToTwitchComponent.props.fromSettings).toEqual(undefined);
  });
});
