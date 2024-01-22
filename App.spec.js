/**
 * @format
 */
jest.useFakeTimers();
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';

jest.mock('@babylonjs/react-native', () => {
  return {
    useEngine: jest.fn().mockImplementation(() => {}),
  };
});
it.skip('renders correctly', async () => {
  //skipping this test until we write actual expected outputs
  await renderer.create(<App />);
});
