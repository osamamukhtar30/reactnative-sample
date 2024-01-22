export const handleSocketMessage = socketMessage => {
  return (dispatch, getState) => {
    const {account: currentUser} = getState().currentUser;
    const {type, ...message} = socketMessage;
    const payload = {message, currentUser};
    dispatch({type, payload, dispatch});
  };
};

export const connectToSocket = (userId, providerIdentifierId) => ({
  type: 'WS_CONNECT',
  payload: {
    providerIdentifierId,
    userId,
    topic: `/topic/user/${userId}`,
  },
});

export const subscribeToTopic = topic => ({
  type: 'WS_SUBSCRIBE',
  payload: {
    topic,
    onMessageAction: handleSocketMessage,
  },
});

export const unsubscribeFromTopic = topicId => ({
  type: 'WS_UNSUBSCRIBE',
  payload: {
    topicId,
  },
});
