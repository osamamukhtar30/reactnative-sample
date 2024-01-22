import {combineReducers} from 'redux';
import p3Notifications from '@duelme/apisdk/dist/slices/p3Notification/native';
import currentUser from '@duelme/apisdk/dist/slices/currentUser/native';
import games from '@duelme/apisdk/dist/slices/games/native';
import loading from '@duelme/apisdk/dist/slices/loading/native';
import quickActions from '@duelme/apisdk/dist/slices/quickActions/native';
import friendships from '@duelme/apisdk/dist/slices/friendships/native';
import socket from '@duelme/apisdk/dist/slices/socket/native';
import friends from '@duelme/apisdk/dist/slices/friends/native';
import gameAccounts from '@duelme/apisdk/dist/slices/gameAccounts/native';
import wallets from '@duelme/apisdk/dist/slices/wallets/native';
import matches from '@duelme/apisdk/dist/slices/matches/native';
import tournaments from '@duelme/apisdk/dist/slices/tournaments/native';
import matchmaking from '@duelme/apisdk/dist/slices/matchmaking/native';
import buyIns from '@duelme/apisdk/dist/slices/buyIns/native';
import payments from '@duelme/apisdk/dist/slices/payments/native';
import featureFlags from '@duelme/apisdk/dist/slices/featureFlags/native';
import news from '@duelme/apisdk/dist/slices/news/native';
import modal from '@duelme/apisdk/dist/slices/modal/native';
import liveStreams from '@duelme/apisdk/dist/slices/liveStreams/native';
import chats from '@duelme/apisdk/dist/slices/chats/native';
import rankings from '@duelme/apisdk/dist/slices/rankings/native';
import users from '@duelme/apisdk/dist/slices/users/native';
import matchChat from '@duelme/apisdk/dist/slices/matchChat/native';
import activeUsers from '@duelme/apisdk/dist/slices/activeUsers/native';
import tokens from '@duelme/apisdk/dist/slices/tokens/native';
import tutorial from '@duelme/apisdk/dist/slices/tutorial/native';
import p1Notifications from '@duelme/apisdk/dist/slices/p1Notification/native';
import externalWallet from '@duelme/apisdk/dist/slices/externalWallet/native';
import matchHistory from '@duelme/apisdk/dist/slices/matchHistory/native';
import scheduledMatches from '@duelme/apisdk/dist/slices/scheduleMatch/native';
import tournamentChat from '@duelme/apisdk/dist/slices/tournamentChat/native';

import socketMiddlewareReducer from './reducers/socketMiddlewareReducer';
import asyncNavigator from './reducers/asyncNavigatorReducer';

const createRootReducer = () => {
  const appReducer = combineReducers({
    p3Notifications,
    currentUser,
    games,
    loading,
    quickActions,
    friendships,
    socket,
    friends,
    gameAccounts,
    wallets,
    matches,
    tournaments,
    matchmaking,
    buyIns,
    payments,
    featureFlags,
    news,
    modal,
    liveStreams,
    chats,
    rankings,
    matchChat,
    users,
    activeUsers,
    tokens,
    tutorial,
    p1Notifications,
    externalWallet,
    matchHistory,
    asyncNavigator,
    scheduledMatches,
    tournamentChat,
  });

  return (state, action) => {
    if (action.type === 'RESET_STATE') {
      const {games, news} = state;
      state = {games, news};
    }
    let intermediateState = appReducer(state, action);
    return socketMiddlewareReducer(intermediateState, action);
  };
};

export default createRootReducer;
