/**
 * @format
 */
jest.useFakeTimers();
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_PUBLIC_API_URL} from '@duelme/js-constants/dist/api';
import {act, fireEvent} from '@testing-library/react-native';
import React from 'react';

import {mockedNavigate} from '../../../jest.setup';
import {reduxRender} from '../../utils/tests/reduxRender';

import ForgotPassword from './ForgotPassword';

describe('ForgotPassword', () => {
  it('renders correct initial value for username', async () => {
    const wrapper = reduxRender(<ForgotPassword />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('username-field');
    expect(field.props.value).toEqual('');
  });

  it('renders correct isInvalid value for username', async () => {
    const wrapper = reduxRender(<ForgotPassword />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('username-field');
    expect(field.props.value).toEqual('');
    expect(field.props.isInvalid).toEqual(true);
  });

  it('renders correct isInvalid value for username after text change', async () => {
    const wrapper = reduxRender(<ForgotPassword />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('username-field');
    expect(field.props.value).toEqual('');
    expect(field.props.isInvalid).toEqual(true);

    await act(async () => await fireEvent.changeText(field, 'test-user'));

    expect(field.props.value).toEqual('test-user');
    expect(field.props.isInvalid).toEqual(false);
  });

  it('navigates correctly on already have passcode button press', async () => {
    const wrapper = reduxRender(<ForgotPassword />, {
      initialState: {},
    });
    const button = await wrapper.findByTestId('already-code-button');
    const field = await wrapper.findByTestId('username-field');
    await act(async () => await fireEvent.changeText(field, 'test-user'));

    await act(async () => await fireEvent.press(button));

    expect(mockedNavigate).toBeCalledWith('VerificationCodeStep', {username: 'test-user'});
  });

  it('navigates correctly on forgot username button press', async () => {
    const wrapper = reduxRender(<ForgotPassword />, {
      initialState: {},
    });
    const button = await wrapper.findByTestId('forgot-username');

    await act(async () => await fireEvent.press(button));

    expect(mockedNavigate).toBeCalledWith('ForgotUsername');
  });

  it('calls correct api on forgot password button press', async () => {
    const axios = AxiosService.getAxios();
    jest.spyOn(axios, 'post');
    const wrapper = reduxRender(<ForgotPassword />, {
      initialState: {},
    });
    const field = await wrapper.findByTestId('username-field');
    await act(async () => await fireEvent.changeText(field, 'test-user'));
    const button = await wrapper.findByTestId('forgot-password');

    await act(async () => await fireEvent.press(button));

    expect(axios.post).toBeCalledWith(`${BASE_PUBLIC_API_URL}/request-recover`, {username: 'test-user'});
  });
});
