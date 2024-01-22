import React from 'react';
import styled from 'styled-components/native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import BlurViewContainer from '../../components/BlurViewContainer/BlurViewContainer';
import BackgroundImage from '../../components/background/BackgroundImage';
import ConnectToTwitchComponent from '../../components/ConnectToTwitch/ConnectToTwitch';
import BottomBackArrow from '../../components/BottomBackArrow';

const Container = styled.View`
  height: ${hp(100)}px;
`;

const BackContainer = styled.View`
  position: absolute;
  top: ${({insetTop}) => insetTop + hp(1)}px;
  z-index: 5;
`;

const ConnectToTwitch = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <BlurViewContainer>
      <BackgroundImage />
      <Container testID="connect-to-twitch-feature">
        <BackContainer insetTop={insets.top}>
          <BottomBackArrow
            onBack={() => {
              navigation.pop();
            }}
          />
        </BackContainer>
        <ConnectToTwitchComponent
          callback={() => {
            navigation.pop();
          }}
        />
      </Container>
    </BlurViewContainer>
  );
};

export default ConnectToTwitch;
