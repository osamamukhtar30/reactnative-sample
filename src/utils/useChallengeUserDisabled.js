import {useSelector} from 'react-redux';
import {selectCurrentMatchId} from '@duelme/apisdk/dist/slices/matches/selectors';
import {selectActiveStatus} from '@duelme/apisdk/dist/slices/userStatus/selectors';
import {selectMatchmakingStatus} from '@duelme/apisdk/dist/slices/matchmaking/selectors';
import {selectQuickActionsByUserId} from '@duelme/apisdk/dist/slices/quickActions/selectors';
import {USER_STATUS_BANNED, USER_STATUS_PERMABAN} from '@duelme/js-constants/dist/userStatus';
import {
  PUBLIC_USER_STATUS_OFFLINE,
  PUBLIC_USER_STATUS_PENDING_ACCEPT_MATCHMAKING,
  PUBLIC_USER_STATUS_IN_MATCH,
} from '@duelme/js-constants/dist/friends';
import {STATUS_MM_PENDING_ACCEPT} from '@duelme/js-constants/dist/matchmaking';
import {useVerificationCheck} from '@duelme/apisdk/dist/hooks/verification';

const useChallengeUserDisabled = ({user}) => {
  const accountVerified = useVerificationCheck()[1];
  const currentUserInMatch = !!useSelector(selectCurrentMatchId);
  const currentUserIsBanned = [USER_STATUS_BANNED, USER_STATUS_PERMABAN].includes(useSelector(selectActiveStatus));
  const currentUserPendingMatchmaking = useSelector(selectMatchmakingStatus) === STATUS_MM_PENDING_ACCEPT;

  const currentUserDisabled =
    currentUserInMatch || currentUserPendingMatchmaking || currentUserIsBanned || !accountVerified;
  const quickActions = useSelector(state => selectQuickActionsByUserId(state, user.id));

  let hasSentChallenge = false;
  quickActions.forEach(action => {
    if (action.type === 'QUICK_CHALLENGE_INVITATION') {
      hasSentChallenge = true;
    }
  });

  const challengeDisabled =
    [PUBLIC_USER_STATUS_IN_MATCH, PUBLIC_USER_STATUS_OFFLINE, PUBLIC_USER_STATUS_PENDING_ACCEPT_MATCHMAKING].includes(
      user?.status,
    ) ||
    hasSentChallenge ||
    currentUserDisabled;

  return challengeDisabled;
};

export default useChallengeUserDisabled;
