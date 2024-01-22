import React from 'react';
import ReactNative, {ImageBackground} from 'react-native';
import styled from 'styled-components/native';

const Background = styled(ImageBackground)`
  position: absolute;
  top: 0px;
  left: 0px;
  right: ${ReactNative.Platform.OS === 'ios' ? 0 : -1}px;
  bottom: 0px;
`;

// right 0 in Android produce an empty space on the right

const BackgroundImage = ({url}) => {
  return (
    <Background
      testID="background-image"
      source={url ? url : require('../../assets/Backgrounds/main.webp')}
    ></Background>
  );
};

export default BackgroundImage;
