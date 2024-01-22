import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import ReactNative from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import theme from '../../global-styles/theme';

const Background = styled(LinearGradient)`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: ${ReactNative.Platform.OS === 'ios' ? 0 : -1}px;
  height: ${({header}) => header}px;
`;

// right 0 in Android produce an empty space on the right

const Bottom = ({height = 13}) => {
  return (
    <Background
      pointerEvents="none"
      colors={['transparent', theme.colors.darkPurple]}
      start={{x: 1, y: 0}}
      end={{x: 1, y: 0.8}}
      header={hp(height)}
    />
  );
};

export default Bottom;
