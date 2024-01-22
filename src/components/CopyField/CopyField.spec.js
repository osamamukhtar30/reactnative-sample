/**
 * @format
 */
jest.useFakeTimers();
import React from 'react';
import {expect} from '@jest/globals';
import {act, fireEvent} from '@testing-library/react-native';
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';

import {reduxRender} from '../../utils/tests/reduxRender';

import CopyField from './CopyField';

describe('CopyField', () => {
  it('renders correct copy text', async () => {
    const wrapper = reduxRender(<CopyField text={'test'} />, {
      initialState: {},
    });
    const copyText = await wrapper.findByTestId('copy-text');
    expect(copyText.props.children).toEqual(`test`);
  });

  it('copies text on copy button press', async () => {
    const wrapper = reduxRender(<CopyField text={'test'} />, {
      initialState: {},
    });

    jest.spyOn(mockClipboard, 'setString');
    const copyButton = await wrapper.findByTestId('copy-button');
    await act(async () => {
      await fireEvent.press(copyButton);
    });
    expect(mockClipboard.setString).toBeCalledWith(`test`);
  });
});
