import {configureStore} from '@reduxjs/toolkit';

import createRootReducer from './rootReducer';
import socketMiddleware from './middlewares/socket/middleware';

export const createStore = initialState => {
  return configureStore({
    reducer: createRootReducer(),
    preloadedState: initialState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat([socketMiddleware()]),
  });
};
