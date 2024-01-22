import React from 'react';
import {mockGamesState} from '@duelme/testing-library/dist/factories/games';
import {expect} from '@jest/globals';
import {fireEvent} from '@testing-library/react-native';
import {Platform} from 'react-native';

import {reduxRender} from '../../utils/tests/reduxRender';
import {mockedNavigate} from '../../../jest.setup';

import GameCards from './GameCard';

beforeAll(() => {
  Object.defineProperty(Platform, 'OS', {get: jest.fn(() => 'android')});
});
describe('Game Cards', () => {
  it('All Game Cards are rendered', async () => {
    const initialState = {
      games: mockGamesState,
    };
    const wrapper = reduxRender(<GameCards />, {initialState});
    const result = await wrapper.findAllByTestId('game-card');

    //slice because initialNumberToRender prop is set to 2
    //filter becuase that check is in place before rendering card

    expect(result.length).toEqual(
      Object.values(mockGamesState.entities)
        .slice(0, 2)
        .filter(game => !game.underMaintenance && game.included).length,
    );
  });
  it('Navigate to playNow on card press', async () => {
    const initialState = {
      games: {
        ids: [mockGamesState.ids[0]],
        entities: {
          [mockGamesState.ids[0]]: mockGamesState.entities[mockGamesState.ids[0]],
        },
      },
    };
    const wrapper = reduxRender(<GameCards />, {initialState});
    const button = await wrapper.findByTestId('card-button');
    fireEvent.press(button);
    expect(mockedNavigate).toBeCalledWith('PlayNow');
  });
});
