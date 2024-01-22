import React from 'react';
import styled from 'styled-components/native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import GlowingImage from './GlowingImage';

export const DubbzHeadHeight = hp(30);

const Container = styled.SafeAreaView`
  background-color: transparent;
  margin-vertical: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colors.white};
  text-transform: uppercase;
  text-align: center;
  font-size: ${wp(12)}px;
  font-family: 'Decimal-Light';
  letter-spacing: ${wp(1.5)}px;
  align-self: center;
`;

export const DubbzLogoHeader = () => {
  return (
    <Container>
      <GlowingImage source={require('../assets/Logos/logo.webp')}></GlowingImage>
      <Title>DUBBZ</Title>
    </Container>
  );
};
