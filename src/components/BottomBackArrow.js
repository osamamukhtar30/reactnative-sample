import React from 'react';
import styled from 'styled-components/native';
import {Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

const BackText = styled.Text`
  margin-left: 5px;
  color: ${({theme}) => theme.colors.white};
  font-family: 'Decimal-Light';
`;

const BackContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Container = styled.TouchableOpacity`
  padding: ${wp(5)}px;
  flex-direction: row;
  justify-content: flex-start;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-radius: 3px;
  shadow-opacity: 0.4;
  align-self: flex-start;
`;

const BottomBackArrow = props => {
  const [t] = useTranslation('global');

  return (
    <Container onPress={() => props.onBack()} testID="back-arrow">
      <BackContainer>
        <Image source={require('../assets/icons/arrow-left.webp')} />
        <BackText>{t('login.forgotPasswordScreen.backButton')}</BackText>
      </BackContainer>
    </Container>
  );
};

export default BottomBackArrow;
