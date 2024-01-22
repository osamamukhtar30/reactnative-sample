import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';

import theme from './../../global-styles/theme';

const Container = styled.TouchableOpacity`
  margin: 5px 0px;
  background-color: #ffffff20;
  border: 1px solid #ffffff60;
  ${({disabled}) =>
    disabled &&
    `
    border: 1px solid #ffffff20;
    background-color: #ffffff10;
  `}
  width: 100%;
  border-radius: 25px;
  justify-content: center;
`;

const ScrollableContainer = styled.View`
  width: 100%;
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Text = styled.Text`
  margin-left: 15px;
  text-transform: uppercase;
  color: ${({theme}) => theme.colors.white};
  ${({theme, disabled}) => disabled && `color: ${theme.colors.grey};`}
  font-family: 'Quantico-Bold;
`;

const IconContainer = styled.View`
  position: absolute;
  right: 15px;
`;

const Label = styled.Text`
  margin-left: 3px;
  font-size: 14px;
  text-transform: uppercase;
  color: ${({theme}) => theme.colors.white};
`;

const OutContainer = styled.View`
  margin: 10px 0px;
`;

const FieldTrigger = ({leftItem, text, onPress, icon, label, disabled = false}) => {
  return (
    <OutContainer>
      {label && <Label>{label}</Label>}
      <Container disabled={disabled} onPress={onPress}>
        <ScrollableContainer horizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          {leftItem && leftItem}
          <Text disabled={disabled}>{text}</Text>
        </ScrollableContainer>
        {icon && (
          <IconContainer>
            <Icon name={icon} color={disabled ? theme.colors.grey : theme.colors.white} type="light" size={18} />
          </IconContainer>
        )}
      </Container>
    </OutContainer>
  );
};

export default FieldTrigger;
