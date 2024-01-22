import React from 'react';
import {fireEvent, act, waitFor} from '@testing-library/react-native';
import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {BASE_PUBLIC_API_URL, BASE_APP_API_URL} from '@duelme/js-constants/dist/api';
import * as modal from '@duelme/apisdk/dist/slices/modal/native';

import {server} from '../../common/tests/mockServer/server';

import {reduxRender} from './../../utils/tests/reduxRender';
import AvatarCreation from './AvatarCreation';

describe('AvatarCreation', () => {
  beforeAll(() => {
    server.listen();
    jest.useFakeTimers();
  });
  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });
  afterAll(() => server.close());

  const axios = AxiosService.getAxios();

  it('renders avatar-creation', async () => {
    const wrapper = reduxRender(<AvatarCreation />, {});
    await wrapper.findByTestId('avatar-creation');
  });

  it('renders avatar-creation', async () => {
    jest.spyOn(axios, 'get').mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: [
            {
              url: 'https://test-url.com/1',
              fullBodyPosture: 'https://test-posture.com/1',
            },
            {
              url: 'https://test-url.com/2',
              fullBodyPosture: 'https://test-posture.com/2',
            },
          ],
        }),
      ),
    );

    const wrapper = reduxRender(<AvatarCreation />, {});

    await wrapper.findByText('choose');
    await wrapper.findByText(' avatar');

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toBeCalledWith(`${BASE_PUBLIC_API_URL}/default-avatars`);
    });

    const modelOne = await wrapper.findByTestId('model-one');
    expect(modelOne.props.source).toEqual({uri: 'https://test-posture.com/1'});

    const modelTwo = await wrapper.findByTestId('model-two');
    expect(modelTwo.props.source).toEqual({uri: 'https://test-posture.com/2'});

    await wrapper.findByTestId('model-one-controller-selected');
    await wrapper.findByTestId('model-two-controller-unselected');

    await wrapper.findByText('save');
    await wrapper.findByText('Customize');
  });

  it('calls api correctly when clicking save', async () => {
    jest.spyOn(axios, 'put').mockReturnValue(new Promise(resolve => resolve({data: {}})));

    const wrapper = reduxRender(<AvatarCreation />, {});

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    const saveButton = await wrapper.findByText('save');

    act(() => fireEvent.press(saveButton));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.put).toBeCalledWith(`${BASE_APP_API_URL}/users/me/avatar`, {
        avatarURL: 'https://test-url.com/1',
      });
    });
  });

  it('opens modal when clickin customize', async () => {
    const openModalMock = jest.spyOn(modal, 'openModal');

    jest.spyOn(axios, 'put').mockReturnValue(new Promise(resolve => resolve({data: {}})));

    const wrapper = reduxRender(<AvatarCreation />, {});

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    const customizeButton = await wrapper.findByText('Customize');

    act(() => fireEvent.press(customizeButton));

    await waitFor(() => {
      expect(openModalMock).toHaveBeenCalledTimes(1);
      expect(openModalMock).toBeCalledWith('customizeAvatar', {
        successCallback: expect.anything(),
      });
    });
  });
});
