import React from 'react';
import {fireEvent, waitFor, act} from '@testing-library/react-native';

import {reduxRender} from '../../utils/tests/reduxRender';
import {server} from '../../common/tests/mockServer/server';

import ConfirmScreen from './ConfirmScreen';

describe('ConfirmScreen', () => {
  beforeAll(() => server.listen());
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => server.close());

  it('renders confirm-screen', async () => {
    const wrapper = reduxRender(
      <ConfirmScreen
        route={{
          params: {
            handleContinue: () => {},
            handleBack: () => {},
            continueText: 'continue',
            backText: 'back',
            text: 'Testing component',
          },
        }}
      />,
      {},
    );
    await wrapper.findByTestId('confirm-screen');
  });

  it('renders backText, continueText and text', async () => {
    const wrapper = reduxRender(
      <ConfirmScreen
        route={{
          params: {
            handleContinue: () => {},
            handleBack: () => {},
            continueText: 'continue',
            backText: 'back',
            text: 'Testing component',
          },
        }}
      />,
      {},
    );
    await wrapper.findByText('continue');
    await wrapper.findByText('back');
    await wrapper.findByText('Testing component');
  });

  it('calls handlecontinue when clicking continue button', async () => {
    const continueMock = jest.fn(() => {});
    const wrapper = reduxRender(
      <ConfirmScreen
        route={{
          params: {
            handleContinue: continueMock,
            handleBack: () => {},
            continueText: 'continue',
            backText: 'back',
            text: 'Testing component',
          },
        }}
      />,
      {},
    );
    const continueButton = await wrapper.findByText('continue');
    act(() => fireEvent.press(continueButton));
    await waitFor(() => expect(continueMock).toHaveBeenCalledTimes(1));
  });

  it('calls handleBack when clicking continue button', async () => {
    const backMock = jest.fn(() => {});
    const wrapper = reduxRender(
      <ConfirmScreen
        route={{
          params: {
            handleContinue: () => {},
            handleBack: backMock,
            continueText: 'continue',
            backText: 'back',
            text: 'Testing component',
          },
        }}
      />,
      {},
    );
    const backButton = await wrapper.findByText('back');
    act(() => fireEvent.press(backButton));
    await waitFor(() => expect(backMock).toHaveBeenCalledTimes(1));
  });

  it('does not crash if back text and handle back are missing', async () => {
    const wrapper = reduxRender(
      <ConfirmScreen
        route={{
          params: {
            handleContinue: () => {},
            continueText: 'continue',
            text: 'Testing component',
          },
        }}
      />,
      {},
    );
    await wrapper.findByText('continue');
    await wrapper.findByText('Testing component');
  });
});
