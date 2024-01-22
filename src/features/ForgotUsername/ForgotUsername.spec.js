/**
 * @format
 */

import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_PUBLIC_API_URL} from '@duelme/js-constants/dist/api';
import {act, fireEvent} from '@testing-library/react-native';
import React from 'react';

import {reduxRender} from '../../utils/tests/reduxRender';

import ForgotUsername from './ForgotUsername';

describe('ForgotUsername', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  it('renders correct initial value for email', async () => {
    const wrapper = reduxRender(<ForgotUsername />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('email-field');
    expect(field.props.value).toEqual('');
  });

  it('renders correct isInvalid value for email', async () => {
    const wrapper = reduxRender(<ForgotUsername />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('email-field');
    expect(field.props.value).toEqual('');
    expect(field.props.isInvalid).toEqual(true);
  });

  it('renders correct isInvalid value for email after text change', async () => {
    const wrapper = reduxRender(<ForgotUsername />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('email-field');
    expect(field.props.value).toEqual('');
    expect(field.props.isInvalid).toEqual(true);

    await act(async () => await fireEvent.changeText(field, 'test@email.com'));

    expect(field.props.value).toEqual('test@email.com');
    expect(field.props.isInvalid).toEqual(false);
  });

  it('calls correct api on send email button press', async () => {
    const axios = AxiosService.getAxios();
    jest.spyOn(axios, 'post');
    const wrapper = reduxRender(<ForgotUsername />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('email-field');
    await act(async () => await fireEvent.changeText(field, 'test@email.com'));
    const button = await wrapper.findByTestId('send-email');

    await act(async () => await fireEvent.press(button));

    expect(axios.post).toBeCalledWith(`${BASE_PUBLIC_API_URL}/request-remember-username`, {email: 'test@email.com'});
  });
});
