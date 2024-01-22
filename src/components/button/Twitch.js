import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-fontawesome-pro';

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

const TwitchButton = ({text = 'Twitch', onPress = () => {}}) => {
  return (
    <ButtonContainer onPress={onPress}>
      <Button colors={['#533680', '#a970ff']}>
        <Icon name={'twitch'} type="brands" color="white" size={20} />
        <Text>{text}</Text>
      </Button>
    </ButtonContainer>
  );
};

export default TwitchButton;
