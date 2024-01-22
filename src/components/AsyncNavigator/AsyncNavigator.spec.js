import React from 'react';
import {waitFor} from '@testing-library/react-native';

import {server} from '../../common/tests/mockServer/server';
import {mockedNavigate} from '../../../jest.setup';

import {reduxRender} from './../../utils/tests/reduxRender';
import AsyncNavigator from './AsyncNavigator';
import * as asyncNavigatorReducer from './../../app/reducers/asyncNavigatorReducer';

describe('AsyncNavigator', () => {
  beforeAll(() => {
    server.listen();
    jest.useFakeTimers();
  });
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  it('does not navigate if no screen', async () => {
    reduxRender(<AsyncNavigator />, {
      initialState: {
        asyncNavigator: {
          screen: null,
          params: {},
        },
      },
    });
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(0);
    });
  });

  it('navigates to correct screen with correct parameters', async () => {
    jest.spyOn(asyncNavigatorReducer, 'cleanNavigation').mockReturnValue({type: 'test'});
    reduxRender(<AsyncNavigator />, {
      initialState: {
        asyncNavigator: {
          screen: 'TestScreen',
          params: {
            paramTest: 'param-value',
          },
        },
      },
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toBeCalledWith('TestScreen', {
        paramTest: 'param-value',
      });
    });
    await waitFor(() => {
      expect(asyncNavigatorReducer.cleanNavigation).toHaveBeenCalledTimes(1);
    });
  });
});
