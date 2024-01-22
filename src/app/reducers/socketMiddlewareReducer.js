import {createSlice} from '@reduxjs/toolkit';
import {MATCH_CHAT_MESSAGE, FRIEND_CHAT_MESSAGE} from '@duelme/js-constants/dist/chats';
import {MATCH_CREATION_ERROR} from '@duelme/js-constants/dist/matches';
import Toast from 'react-native-toast-message';
import {acceptFriendRequest, rejectFriendRequest} from '@duelme/apisdk/dist/slices/friendships/thunks';
import {declineQuickInvite} from '@duelme/apisdk/dist/slices/quickActions/thunks';
import {GAME_ID_TO_NAME} from '@duelme/js-constants/dist/games';
import {QUICK_CHALLENGE_OFFER} from '@duelme/js-constants/dist/quickActions';
import {FRIENDSHIP_REQUEST} from '@duelme/js-constants/dist/friends';

import {navigateTo} from './asyncNavigatorReducer';
import {reference} from './../../components/FunctionsForwarder/FunctionsForwarder';

const initialState = {};

export const socketMiddlewareReducer = createSlice({
  name: 'socketMiddlewareReducer',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(MATCH_CHAT_MESSAGE, (state, action) => {
        if (state.currentUser.account.id !== action.payload.message.userId) {
          // If we send the message do not display the toast
          Toast.show({
            type: 'info',
            text1: action.payload.message.message,
            text2: action.payload.message.accountName,
            onPress: () => {
              action.dispatch(navigateTo({screen: 'MatchChat', params: {matchId: action.payload.message.entityId}}));
            },
          });
        }
      })
      .addCase(FRIEND_CHAT_MESSAGE, (state, action) => {
        if (state.currentUser.account.id !== action.payload.message.userId) {
          // If we send the message do not display the toast
          Toast.show({
            type: 'info',
            text1: action.payload.message.message,
            text2: action.payload.message.accountName,
            onPress: () => {
              action.dispatch(navigateTo({screen: 'FriendsTab'}));
            },
          });
        }
      })
      .addCase(MATCH_CREATION_ERROR, () => {
        Toast.show({
          type: 'error',
          text1: reference.translate({key: 'match_error'}),
          text2: reference.translate({key: 'there_was_an_error_creating_the_match'}),
        });
      })
      .addCase(FRIENDSHIP_REQUEST, (state, action) => {
        Toast.show({
          type: 'action',
          props: {
            text: reference.translate({
              key: 'friend_request_from_username',
              params: {
                username: action.payload.message.friendship.usernameFrom,
              },
            }),
            actionOneText: reference.translate({key: 'accept'}),
            actionTwoText: reference.translate({key: 'reject'}),
            actionOne: () => {
              Toast.hide();
              action.dispatch(acceptFriendRequest(action.payload.message.friendship.id));
            },
            actionTwo: () => {
              Toast.hide();
              action.dispatch(rejectFriendRequest(action.payload.message.friendship.id));
            },
          },
        });
      })
      .addCase(QUICK_CHALLENGE_OFFER, (state, action) => {
        const invitation = action.payload.message.quickChallenge;
        Toast.show({
          type: 'action',
          visibilityTime: 30000,
          props: {
            text: reference.translate({
              key: 'entry_fee_game_name_challenge_from_username',
              params: {
                entryFee: invitation?.amount,
                gameName: GAME_ID_TO_NAME[invitation?.gameId],
                username: invitation?.usernameFrom,
              },
            }),
            actionOneText: reference.translate({key: 'accept'}),
            actionTwoText: reference.translate({key: 'reject'}),
            actionOne: () => {
              Toast.hide();
              if (reference) {
                reference.handleAcceptChallenge({
                  challenge: invitation,
                });
              }
            },
            actionTwo: () => {
              Toast.hide();
              action.dispatch(declineQuickInvite(invitation.id));
            },
          },
        });
      });
  },
});

export default socketMiddlewareReducer.reducer;
