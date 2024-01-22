import React from 'react';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {expect} from '@jest/globals';
import {waitFor} from '@testing-library/react-native';
import moment from 'moment';

import {reduxRender} from '../../utils/tests/reduxRender';

import CountDown from './CountDown';
describe('CountDown', () => {
  it('calls finish Callback when timer hits', async () => {
    const initialState = {
      games: mockGamesState,
    };
    const callback = jest.fn();
    reduxRender(
      <CountDown
        runTests={true}
        displayIcon={false}
        targetTime={moment().add(2, 's')}
        onFinished={() => {
          callback();
        }}
        textStyle={{fontWeight: 'bold'}}
      />,
      {initialState},
    );
    await waitFor(() => expect(callback).toBeCalledTimes(1), {timeout: 10000});
  });

  it('renders start text with timer', async () => {
    const initialState = {
      games: mockGamesState,
    };
    const callback = jest.fn();
    const wrapper = reduxRender(
      <CountDown
        runTests={true}
        startText={'label'}
        displayIcon={false}
        targetTime={moment().add(100, 'ms')}
        onFinished={() => {
          callback();
        }}
        textStyle={{fontWeight: 'bold'}}
      />,
      {initialState},
    );
    const text = await wrapper.findByTestId('countdown-text');
    const condition = text.children.includes('label');
    expect(condition).toBeTruthy();
  });

  it('renders end text after timer expires', async () => {
    const initialState = {
      games: mockGamesState,
    };
    const callback = jest.fn();
    const wrapper = reduxRender(
      <CountDown
        runTests={true}
        endText={'ended'}
        displayIcon={false}
        targetTime={moment().add(2, 's')}
        onFinished={() => {
          callback();
        }}
        textStyle={{fontWeight: 'bold'}}
      />,
      {initialState},
    );

    await waitFor(async () => await wrapper.findByTestId('end-text'), {timeout: 10000});
  });
});
