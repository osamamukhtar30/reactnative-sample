import React from 'react';
import styled from 'styled-components/native';

import BlurViewContainer from '../BlurViewContainer/BlurViewContainer';

const BoxContainer = styled.View`
  border: 1px solid ${({theme}) => theme.colors.white};
  border-radius: 20px;
  overflow: hidden;
  justify-content: center;
`;

const BlurPill = ({children}) => {
  return (
    <BoxContainer>
      <BlurViewContainer>{children}</BlurViewContainer>
    </BoxContainer>
  );
};

export default BlurPill;
