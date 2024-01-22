const exposureMiddleware = ({actionType, calls}) => {
  return () => next => async action => {
    switch (action.type) {
      case `${actionType}`:
        {
          calls.push(action);
        }
        break;
      default:
        return next(action);
    }
  };
};

export default exposureMiddleware;
