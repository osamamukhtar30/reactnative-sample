import React from 'react';
import {Text} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components/native';

import {DubbzHeadHeight} from './DubbzLogoHeader';

const Container = styled.View`
  height: ${DubbzHeadHeight}px;
  background-color: ${({theme}) => theme.colors.primaryDark};
`;

const StyledLine = styled.View`
  border-bottom-color: ${({theme}) => theme.colors.red};
  border-bottom-width: 5px;
  position: absolute;
  bottom: 0px;
  width: ${wp('20%')}px;
`;

const StyledText = styled(Text)`
  color: ${({theme}) => theme.colors.red};
  font-size: 40px;
  margin-left: ${wp('6%')};
`;

export const DubbzHead = () => {
  return (
    <Container>
      <StyledText>dubbz</StyledText>
      <StyledLine />
    </Container>
  );
};
