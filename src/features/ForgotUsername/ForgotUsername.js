import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {requestRecoverUsername} from '@duelme/apisdk/dist/slices/account/thunks';
import * as yup from 'yup';

import Button from '../../components/button/Button';
import useSyncEndpointCall from '../../utils/syncEndpointCall';
import {Container, KeypboardAvoidingContainer, SafeScrollView} from '../../components/Container';
import BottomBackArrow from '../../components/BottomBackArrow';
import CustomTextInput from '../../components/Inputs/TextInput';
import {DubbzLogoHeader} from '../../components/DubbzLogoHeader';
import BackgroundImage from '../../components/background/BackgroundImage';
import {HeadTitle, HeadTitleWhite} from '../Signup/components/FormView.styles';
import GlowingImage from '../../components/GlowingImage';
import theme from '../../global-styles/theme';

const LocalContainer = styled.View`
  width: 100%;
  align-items: center;
`;

const InputContainer = styled.View`
  width: 90%;
`;

const ButtonContainer = styled.View`
  width: 90%;
  margin: 20px auto;
`;
const DescriptionText = styled.Text`
  color: ${theme.colors.white};
  text-align: center;
  margin: 20px 20px;
  font-family: 'Decimal-Light';
`;

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Required'),
});

const ForgotUsername = () => {
  const [t] = useTranslation('global');
  const navigation = useNavigation();
  const syncEndpointCall = useSyncEndpointCall();
  const [loading, setLoading] = useState(false);
  return (
    <Container>
      <Formik
        initialValues={{
          email: '',
        }}
        validateOnMount={true}
        validationSchema={validationSchema}
      >
        {({isValid, handleChange, handleBlur, values, errors}) => (
          <>
            <BackgroundImage />
            <SafeScrollView disableBottomInset={true} disableTopInset={true} style={{paddingBottom: 50}}>
              <KeypboardAvoidingContainer>
                <DubbzLogoHeader />

                <LocalContainer>
                  <BottomBackArrow onBack={() => navigation.goBack()} />
                  <HeadTitle>{t('login.forgotUsernameScreen.title1')}</HeadTitle>
                  <HeadTitleWhite>{t('login.forgotUsernameScreen.title2')}</HeadTitleWhite>

                  <GlowingImage
                    showCloud
                    style={{width: 80, height: 80}}
                    source={require('../../assets/forgot-password.webp')}
                  />
                  <DescriptionText>{t('forgot_username_description')}</DescriptionText>
                  <InputContainer>
                    <CustomTextInput
                      testID={'email-field'}
                      value={values.email}
                      label={t('email')}
                      onChangeText={handleChange('email')}
                      handleBlur={handleBlur('email')}
                      isInvalid={!!errors.email}
                      feedback={errors.email}
                    />
                  </InputContainer>
                </LocalContainer>

                <ButtonContainer>
                  <Button
                    testID={'send-email'}
                    loading={loading}
                    disabled={!isValid || Object.keys(errors).length !== 0}
                    onPress={async () => {
                      setLoading(true);
                      await syncEndpointCall({
                        avoidOpenLoading: true,
                        avoidCloseLoading: true,
                        loadingText: t('requesting_username_change'),
                        reduxAction: requestRecoverUsername(values),
                        errorText: t('username_email_was_not_sent'),
                        successText: '',
                        errorCallBack: () => setLoading(false),
                        successCallback: () => {
                          setLoading(false);
                          navigation.navigate('ConfirmationScreen', {username: values.username});
                        },
                      });
                    }}
                    text={t('login.forgotPasswordScreen.firstButton')}
                  />
                </ButtonContainer>
              </KeypboardAvoidingContainer>
            </SafeScrollView>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default ForgotUsername;
