import React from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {fetchQuickInvites, acceptChallenge} from '@duelme/apisdk/dist/slices/quickActions/thunks';
import {useNavigation} from '@react-navigation/core';

import useSyncEndpointCall from './../../utils/syncEndpointCall';
import {useCanPlayMatchApp} from './../../common/hooks/matches';

export let reference = null;

const FunctionsForwarder = () => {
  const navigation = useNavigation();
  const [challenge, setChallenge] = React.useState(null);

  const toastRef = React.useRef(null);

  const canPlayMatchApp = useCanPlayMatchApp(challenge?.gameId, navigation);

  const dispatch = useDispatch();
  const [t] = useTranslation('global');

  React.useEffect(() => {
    if (challenge) {
      const localAcceptChallenge = async ({useExternalWallet}) => {
        await syncEndpointCall({
          loadingText: t('notifications.acceptingChallenge'),
          reduxAction: acceptChallenge({
            challengeId: challenge.id,
            useExternalWallet,
          }),
          successCallback: () => {
            dispatch(fetchQuickInvites());
          },
          avoidCloseLoading: true,
        });
      };
      canPlayMatchApp({amount: challenge.amount}, localAcceptChallenge);
      setChallenge(null);
    }
  }, [canPlayMatchApp]);

  const setRef = React.useCallback(ref => {
    if (ref) {
      toastRef.current = ref;
      reference = toastRef.current;
    } else {
      reference = null;
    }
  }, []);

  const syncEndpointCall = useSyncEndpointCall();
  const translate = ({key, params = {}}) => t(key, params);

  const handleAcceptChallenge = async ({challenge}) => {
    setChallenge(challenge);
  };

  React.useImperativeHandle(
    setRef,
    React.useCallback(
      () => ({
        handleAcceptChallenge,
        translate,
      }),
      [handleAcceptChallenge, translate],
    ),
  );

  return <></>;
};

export default FunctionsForwarder;
