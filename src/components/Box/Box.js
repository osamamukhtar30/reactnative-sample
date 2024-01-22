import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';
import LinearGradient from 'react-native-linear-gradient';

import theme from './../../global-styles/theme';

const BoxContainer = styled(LinearGradient)`
  border: 1px solid ${({theme}) => theme.colors.white};
  border-radius: 10px;
  padding-bottom: 10px;
  margin: 10px 0px;
`;

const TitleContainer = styled.View`
  padding: 20px 25px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const IconContainer = styled.View`
  margin-left: auto;
  flex-direction: row;
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: 18px;
  font-family: Quantico-Bold;
`;

const Box = ({children, title, icons = []}) => {
  return (
    <BoxContainer
      colors={['rgba(255, 255, 255, 0.07)', 'rgba(20, 36, 63, 0.07)', 'rgba(49, 49, 49, 0.0602)']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
    >
      <TitleContainer>
        <Title>{title}</Title>
        {icons.length > 0 && (
          <IconContainer>
            {icons.map((icon, index) => (
              <Icon
                onPress={icon.disabled ? null : icon.onPress}
                key={index}
                iconStyle={{marginHorizontal: 5}}
                name={icon.name}
                color={icon.onPress && !icon.disabled ? theme.colors.white : theme.colors.grey}
                type="solid"
                size={20}
              />
            ))}
          </IconContainer>
        )}
      </TitleContainer>
      {children}
    </BoxContainer>
  );
};

export default Box;
