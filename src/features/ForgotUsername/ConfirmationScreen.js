import React from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {Container, KeypboardAvoidingContainer, SafeScrollView} from '../../components/Container';
import BottomBackArrow from '../../components/BottomBackArrow';
import {DubbzLogoHeader} from '../../components/DubbzLogoHeader';
import BackgroundImage from '../../components/background/BackgroundImage';
import {HeadTitle, HeadTitleWhite} from '../Signup/components/FormView.styles';
import GlowingImage from '../../components/GlowingImage';
import theme from '../../global-styles/theme';
import Button from '../../components/button/Button';

const LocalContainer = styled.View`
  width: 100%;
  align-items: center;
`;
const DescriptionText = styled.Text`
  color: ${theme.colors.white};
  text-align: center;
  margin: 40px 20px;
  font-size: 18px;
  font-family: 'Decimal-Light';
`;
const ButtonContainer = styled.View`
  width: 90%;
  margin: 20px auto;
`;

const ConfirmationScreen = () => {
  const [t] = useTranslation('global');
  const navigation = useNavigation();

  return (
    <Container>
      <>
        <BackgroundImage />
        <SafeScrollView disableBottomInset={true} disableTopInset={true}>
          <KeypboardAvoidingContainer>
            <DubbzLogoHeader />

            <LocalContainer>
              <BottomBackArrow onBack={() => navigation.navigate('ForgotPassword')} />
              <HeadTitle>{t('login.confirmationScreen.title1')}</HeadTitle>
              <HeadTitleWhite>{t('login.confirmationScreen.title2')}</HeadTitleWhite>

              <GlowingImage
                showCloud
                style={{width: 50, height: 50}}
                source={require('../../assets/checked-forgot-password.webp')}
              />
              <DescriptionText>{t('login.confirmationScreen.secondStepDescription')}</DescriptionText>
              <ButtonContainer>
                <Button
                  onPress={async () => {
                    navigation.navigate('Login');
                  }}
                  text={t('login.login')}
                />
              </ButtonContainer>
            </LocalContainer>
          </KeypboardAvoidingContainer>
        </SafeScrollView>
      </>
    </Container>
  );
};

export default ConfirmationScreen;
