import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {displayLoading} from '@duelme/apisdk/dist/slices/loading/native';
import Toast from 'react-native-toast-message';

export const useSyncEndpointCall = () => {
  const dispatch = useDispatch();
  const {t} = useTranslation('global');

  return async ({
    loadingText,
    reduxAction,
    errorText = false,
    successText = false,
    successTextDescription = '',
    successCallback = () => {},
    errorCallBack = () => {},
    avoidToast = null,
    avoidCloseLoading = false,
    avoidOpenLoading = false,
  }) => {
    if (!avoidOpenLoading) {
      dispatch(displayLoading({display: true, text: loadingText}));
    }
    const resp = await dispatch(reduxAction);
    if (!avoidCloseLoading) {
      // Other event will close the loading
      dispatch(displayLoading({display: false}));
    }
    if (resp.error) {
      const errorKey = resp?.payload?.message ? resp?.payload?.message : resp?.error?.message;
      const errorMessage = t(`errors.${errorKey}`, errorText);
      errorCallBack(resp);
      if (errorMessage && !(avoidToast && avoidToast(resp))) {
        Toast.show({
          type: 'error',
          text1: errorMessage,
        });
      }
    } else {
      if (successText) {
        let body = {
          type: 'success',
          text1: successText,
        };
        if (successTextDescription) {
          body['text2'] = successTextDescription;
        }
        Toast.show(body);
      }
      successCallback(resp);
    }
  };
};

export default useSyncEndpointCall;
