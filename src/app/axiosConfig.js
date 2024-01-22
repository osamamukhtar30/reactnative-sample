import AxiosService from '@duelme/apisdk/dist/services/AxiosService';
import {logout} from '@duelme/apisdk/dist/slices/account/thunks';
import {SECRET_HEADER} from 'react-native-dotenv';

export default store => {
  const errorCallback = error => {
    // if error is 401 and code is invalid token

    let response = error.response;

    if (!response && !response.config.__isRetryRequest) {
      AxiosService.getAxios().interceptors.request.handlers = [];
      response.config.__isRetryRequest = true;
      return AxiosService.getAxios()(response.config);
    }

    if (!response) {
      return Promise.reject('Network response');
    }

    if (response.status === 418) {
      return Promise.reject('sorry_dubbz_is_not_available_in_your_region');
    }

    if (response.status === 401 && response.config && !response.config.__isRetryRequest) {
      // remove token from sessionStorage, remove interceptors and retry
      store.dispatch(logout());
      response.config.__isRetryRequest = true;
      delete response.config.headers.authorization;
      return AxiosService.getAxios()(response.config);
    } else {
      if (response.data) {
        return Promise.reject(response.data);
      } else {
        return Promise.reject(response);
      }
    }
  };

  AxiosService.addInterceptor({interceptor: errorCallback});

  if (SECRET_HEADER) {
    AxiosService.getAxios().defaults.headers.common['SECRET_HEADER'] = SECRET_HEADER;
  }
};
