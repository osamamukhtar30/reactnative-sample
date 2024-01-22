import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-fontawesome-pro';

import theme from './../../global-styles/theme';

const ButtonContainer = styled.TouchableOpacity`
  margin: 10px 0px;
`;

const Button = styled(LinearGradient)`
  padding: 20px 10px;
  border-radius: 5px;
  border: 1px solid ${({theme}) => theme.colors.white};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const Text = styled.Text`
  color: ${({theme}) => theme.colors.white};
  text-transform: uppercase;
  margin-left: 5px;
`;

const SteamButton = ({text = 'STEAM', onPress = () => {}, secondary = false}) => {
  return (
    <ButtonContainer testID="steam-button" onPress={onPress}>
      <Button colors={[secondary ? 'transparent' : '#0e1829', secondary ? 'transparent' : '#1280b1']}>
        <Icon name={'steam-symbol'} type="brands" color={theme.colors.white} size={20} />
        <Text>{text}</Text>
      </Button>
    </ButtonContainer>
  );
};

export default SteamButton;
