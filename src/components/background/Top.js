import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import ReactNative from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import theme from '../../global-styles/theme';

const TopSolidColor = styled.View`
  position: absolute;
  background-color: ${theme.colors.darkPurple};
  top: 0px;
  left: 0px;
  right: ${ReactNative.Platform.OS === 'ios' ? 0 : -1}px;
  height: ${hp(3)}px;
`;

const Background = styled(LinearGradient)`
  position: absolute;
  top: ${hp(3)}px;
  left: 0px;
  right: ${ReactNative.Platform.OS === 'ios' ? 0 : -1}px;
  height: ${({header}) => header}px;
`;

// right 0 in Android produce an empty space on the right

const Top = () => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <TopSolidColor />
      <Background
        pointerEvents="none"
        colors={[theme.colors.darkPurple, 'transparent']}
        start={{x: 0, y: 0.3}}
        end={{x: 0, y: 0.8}}
        header={hp(15) + insets.top}
      />
    </>
  );
};

export default Top;
