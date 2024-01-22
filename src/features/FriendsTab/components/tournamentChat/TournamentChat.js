import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {fetchTournament} from '@duelme/apisdk/dist/slices/tournaments/thunks';
import {selectTournamentById} from '@duelme/apisdk/dist/slices/tournaments/selectors';

import ChatItem from '../friend/ChatItem';

const TournamentChat = ({tournamentId}) => {
  const currentUser = useSelector(selectCurrentUser);
  const tournament = useSelector(state => selectTournamentById(state, tournamentId));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!tournament) {
      dispatch(fetchTournament({tournamentId}));
    }
  }, [tournament]);

  return (
    <ChatItem
      tournamentMode={true}
      tournamentStatus={tournament?.status}
      currentUser={currentUser}
      tournamentName={tournament?.name}
      tournamentId={tournamentId}
    ></ChatItem>
  );
};

export default TournamentChat;
