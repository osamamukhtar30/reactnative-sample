import React from 'react';
import styled from 'styled-components/native';
import ReactNative from 'react-native';
import * as blur from '@react-native-community/blur';

const StyledBlurView = styled.View`
  border-radius: ${({borderRadius}) => borderRadius}px;
`;

const Container = styled.View`
  border-radius: ${({borderRadius}) => borderRadius}px;
  overflow: hidden;
`;

const AndroidBlur = styled.View`
  background-color: ${({androidOpacity, androidRgb}) => `rgba(${androidRgb}, ${androidOpacity})`};
`;

const Blur = styled(ReactNative.Platform.OS === 'ios' ? blur.BlurView : AndroidBlur)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const OpacityBox = styled.View``;

export const BlurViewContainer = ({
  borderRadius = 1,
  children,
  blurType = 'dark',
  width = null,
  height = null,
  androidOpacity = 0.9,
  androidRgb = '0, 0, 0',
}) => {
  return (
    <Container borderRadius={borderRadius}>
      <StyledBlurView width={width} height={height} overlayColor="transparent" borderRadius={borderRadius}>
        <Blur androidOpacity={androidOpacity} androidRgb={androidRgb} borderRadius={borderRadius} blurType={blurType} />
        <OpacityBox isAndroid={ReactNative.Platform.OS !== 'ios'} blurType={blurType}>
          {children}
        </OpacityBox>
      </StyledBlurView>
    </Container>
  );
};

export default BlurViewContainer;
