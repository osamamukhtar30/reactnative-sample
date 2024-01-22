import React from 'react';
// eslint-disable-next-line
import {useEngine} from '@babylonjs/react-native';
import ReactNative from 'react-native';

const EngineContext = React.createContext({
  engine: null,
});

export const EngineContextConsumer = EngineContext.Consumer;

const BabylonEngineContext = ({children}) => {
  const engine = ReactNative.Platform.OS === 'ios' ? useEngine() : null;

  return <EngineContext.Provider value={{engine}}>{children}</EngineContext.Provider>;
};

export default BabylonEngineContext;
