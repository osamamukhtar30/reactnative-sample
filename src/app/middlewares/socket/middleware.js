import {Client} from '@stomp/stompjs';
import {BASE_WS_URL} from '@duelme/apisdk/dist/constants/global';
import AuthService from '@duelme/apisdk/dist/services/AuthService';
import {
  socketConnected,
  socketDisconnected,
  socketError,
  socketSubscribe,
} from '@duelme/apisdk/dist/slices/socket/native';

import {subscribeToTopic} from './actions';

const socketMiddleware = () => {
  let socket = null;

  const onClose = store => () => {
    store.dispatch(socketDisconnected());
  };

  const onConnect = (store, config) => () => {
    const {topic} = config;
    store.dispatch(socketConnected());
    store.dispatch(subscribeToTopic(topic));
  };

  const onError = store => e => {
    store.dispatch(socketError(e.headers.message));
    store.dispatch(socketDisconnected());
  };

  const onMessage = (store, onMessageAction) => message => {
    const messageBody = JSON.parse(message.body);
    store.dispatch(onMessageAction(messageBody));
  };

  // the middleware part of this function
  return store => next => async action => {
    switch (action.type) {
      case 'WS_CONNECT': {
        const accessToken = await AuthService.getAccessToken();
        if (socket !== null) {
          socket.deactivate();
        }
        socket = new Client({
          // FIX START
          // TODO: This is needed because there is an underlying error in react native that prevent stomp from working in android
          // BTW this fix is not perfect and may cause data loss, investigate and try other approaches
          // https://stomp-js.github.io/workaround/stompjs/rx-stomp/ng2-stompjs/react-native-additional-notes.html
          forceBinaryWSFrames: true,
          appendMissingNULLonIncoming: true,
          // FIX END
          brokerURL: `${BASE_WS_URL}`,
          connectHeaders: {
            userId: action.payload.providerIdentifierId,
            'X-Authorization': `Bearer ${accessToken} `,
          },
        });
        socket.onConnect = onConnect(store, action.payload);
        socket.onDisconnect = onClose(store);
        socket.onStompError = onError(store);
        socket.activate();
        break;
      }
      case 'WS_SUBSCRIBE': {
        const {topic, onMessageAction} = action.payload;
        if (!socket) {
          store.dispatch(socketDisconnected());
          return;
        }
        const subscription = socket.subscribe(topic, onMessage(store, onMessageAction));
        store.dispatch(
          socketSubscribe({
            id: subscription.id,
            topic,
          }),
        );
        break;
      }
      case 'WS_UNSUBSCRIBE': {
        const {topicId} = action.payload;
        if (socket) {
          socket.unsubscribe(topicId);
        }
        break;
      }
      case 'WS_DISCONNECT': {
        if (socket !== null) {
          socket.deactivate();
        }
        socket = null;
        break;
      }
      case 'NEW_MESSAGE': {
        let {destination, body} = action.payload;
        socket.publish({
          destination,
          body: JSON.stringify(body),
        });
        break;
      }
      case 'RECENT_WINNER': {
        break;
      }
      default:
        return next(action);
    }
  };
};

export default socketMiddleware;
