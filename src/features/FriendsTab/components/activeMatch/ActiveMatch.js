import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {selectCurrentMatchId, selectOpponentTeam, selectMatchById} from '@duelme/apisdk/dist/slices/matches/selectors';
import {MATCH_STATUS_DISPUTED} from '@duelme/js-constants/dist/matches';
import {fetchMatch} from '@duelme/apisdk/dist/slices/matches/thunks';

import ChatItem from '../friend/ChatItem';

const ActiveMatch = ({matchId}) => {
  const currentUser = useSelector(selectCurrentUser);
  const match = useSelector(state => selectMatchById(state, matchId));
  const opponentTeam = useSelector(state => selectOpponentTeam(state, matchId));
  const opponentCaptain = opponentTeam?.captain;
  const currentMatchId = useSelector(selectCurrentMatchId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!match) {
      dispatch(fetchMatch(matchId));
    }
  }, [match]);

  return currentMatchId === matchId || match?.status === MATCH_STATUS_DISPUTED ? (
    <ChatItem
      matchMode={true}
      opponentCaptain={opponentCaptain}
      matchStatus={match.status}
      currentUser={currentUser}
      matchId={matchId}
    ></ChatItem>
  ) : (
    <></>
  );
};

export default ActiveMatch;
