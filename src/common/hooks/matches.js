import {useCanPlayMatch} from '@duelme/apisdk/dist/hooks/matches';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import {openModal, closeModal} from '@duelme/apisdk/dist/slices/modal/native';
import {displayLoading} from '@duelme/apisdk/dist/slices/loading/native';

import {useShowRules} from '../hooks';

export const useCanPlayMatchApp = (gameId, navigation, isMatchmaking = false) => {
  const dispatch = useDispatch();
  const [t] = useTranslation('global');
  const checkHasAcceptedRules = useShowRules('matchmaking');

  const hasPreMatchWarnings = useCanPlayMatch(
    gameId,
    () => dispatch(displayLoading({display: true, text: t('waiting_for_blockchain_transaction_to_finish')})),
    () => dispatch(displayLoading({display: false})),
  );

  return async (params, matchCreation, callback = () => {}) => {
    if (isMatchmaking) {
      const hasAcceptedRules = await checkHasAcceptedRules();
      if (!hasAcceptedRules) {
        Toast.show({
          type: 'error',
          text1: t('you_need_to_accept_the_rules'),
        });
        callback();
        return;
      }
    }

    const {warning, warnings, isExternalWallet} = await hasPreMatchWarnings(params);
    if (!warning) {
      await matchCreation({useExternalWallet: isExternalWallet});
      callback();
    } else {
      if (warnings.highPriorityWarnings.length !== 0) {
        /*
        POSSIBLE HIGH PRIORITY VALUES
          1099_REQUIRED
          ACCOUNT_NOT_VERIFIED
          USER_BANNED
          IN_A_MATCH
          IN_A_TOURNAMENT
        */
        Toast.show({
          type: 'error',
          text1: t(warnings.highPriorityWarnings[0]),
        });
        callback();
      } else if (warnings.mediumPriorityWarnings.length !== 0) {
        /*
        POSSIBLE MEDIUM PRIORITY VALUES
          NO_GAME_ACCOUNT
          NOT_LOGGED_IN
          CONNECT_TO_TWITCH
          TOURNAMENT_ABOUT_TO_START
          SCHEDULE_MATCH_ABOUT_TO_START
          TOURNAMENT_STARTING_AROUND_GIVEN_TIME
          SCHEDULED_MATCH_STARTING_AROUND_GIVEN_TIME
          ENABLE_PAST_BROADCASTS
          INSUFFICIENT_FUNDS
        */

        const confirmationFlow = confirmationText => {
          dispatch(
            openModal('confirmScreen', {
              text: confirmationText,
              handleBack: async () => {
                dispatch(closeModal());
                callback();
              },
              backText: t('cancel'),
              continueText: t('continue'),
              handleContinue: async () => {
                await matchCreation({useExternalWallet: isExternalWallet});
                dispatch(closeModal());
                callback();
              },
            }),
          );
        };

        const actionMapping = {
          NO_GAME_ACCOUNT: () => {
            navigation.navigate(isMatchmaking ? 'LinkAccount' : 'SettingsLinkAccount', {
              gameId: gameId,
              matchmakingMode: isMatchmaking,
            });
            callback();
          },
          NOT_LOGGED_IN: () => {
            // This is not possible in the App
          },
          CONNECT_TO_TWITCH: () => {
            navigation.navigate('ConnectToTwitch');
            callback();
          },
          TOURNAMENT_ABOUT_TO_START: () => confirmationFlow(t('warning_tournament_starting')),
          SCHEDULE_MATCH_ABOUT_TO_START: () => confirmationFlow(t('warning_scheduled_match_starting')),
          TOURNAMENT_STARTING_AROUND_GIVEN_TIME: () =>
            confirmationFlow(t('warning_tournament_starting_around_given_time')),
          SCHEDULED_MATCH_STARTING_AROUND_GIVEN_TIME: () =>
            confirmationFlow(t('warning_scheduled_match_starting_around_given_time')),
          ENABLE_PAST_BROADCASTS: () => confirmationFlow(t('no_past_broadcast_found_warning')),
          INSUFFICIENT_FUNDS: () => {
            Toast.show({
              type: 'error',
              text1: t('insufficient_funds'),
            });
            dispatch(openModal('deposit'));
            callback();
          },
        };
        actionMapping[warnings.mediumPriorityWarnings[0]]();
      } else {
        Toast.show({
          type: 'error',
          text1: t(warnings.lowPriorityWarnings[0]),
        });
        callback();
      }
    }
  };
};
