import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Formik} from 'formik';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {requestRecoverPassword} from '@duelme/apisdk/dist/slices/account/thunks';
import * as yup from 'yup';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

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
  margin-top: 30px;
`;

const ButtonContainer = styled.View`
  width: 90%;
  margin: 20px auto;
`;

const Text = styled.Text`
  text-align: center;
  margin-top: 10px;
  color: ${({theme, enabled}) => (enabled ? theme.colors.saffron : theme.colors.paradisePink)};
  font-family: Decimal-Light;
  font-size: 14px;
`;
const ForgotPasswordText = styled(Text)`
  margin-top: 0px;
  color: ${theme.colors.white};
  font-size: 14px;
`;

const ForgotPasswordContainer = styled.TouchableOpacity`
  align-self: flex-end;
  margin-right: ${wp(8)}px;
  padding-bottom: 20px;
`;
const validationSchema = yup.object().shape({
  username: yup.string().required(),
});

const ForgotPassword = () => {
  const [t] = useTranslation('global');
  const navigation = useNavigation();
  const syncEndpointCall = useSyncEndpointCall();
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <Formik
        initialValues={{
          username: '',
        }}
        onSubmit={() => {}}
        validateOnMount={true}
        validationSchema={validationSchema}
      >
        {({isValid, handleChange, handleBlur, values, errors, touched}) => (
          <>
            <BackgroundImage />
            <SafeScrollView disableBottomInset={true} disableTopInset={true}>
              <KeypboardAvoidingContainer>
                <DubbzLogoHeader />

                <LocalContainer>
                  <BottomBackArrow onBack={() => navigation.navigate('Login')} />
                  <HeadTitle>{t('login.forgotPasswordScreen.title1')}</HeadTitle>
                  <HeadTitleWhite>{t('login.forgotPasswordScreen.title2')}</HeadTitleWhite>

                  <GlowingImage
                    showCloud
                    style={{width: 80, height: 80}}
                    source={require('../../assets/forgot-password.webp')}
                  />

                  <InputContainer>
                    <CustomTextInput
                      testID={'username-field'}
                      value={values.username}
                      label={t('username')}
                      onChangeText={handleChange('username')}
                      handleBlur={handleBlur('username')}
                      isInvalid={!!errors.username}
                      feedback={touched.username && errors.username}
                    />
                  </InputContainer>
                  <ForgotPasswordContainer
                    testID="forgot-username"
                    onPress={() => {
                      navigation.navigate('ForgotUsername');
                    }}
                  >
                    <ForgotPasswordText>{t('login.forgotUsername')}?</ForgotPasswordText>
                  </ForgotPasswordContainer>
                </LocalContainer>

                <ButtonContainer>
                  <Button
                    testID={'forgot-password'}
                    loading={loading}
                    disabled={!isValid || Object.keys(errors).length !== 0}
                    onPress={async () => {
                      setLoading(true);
                      await syncEndpointCall({
                        avoidOpenLoading: true,
                        avoidCloseLoading: true,
                        loadingText: t('requesting_password_change'),
                        reduxAction: requestRecoverPassword(values),
                        errorText: t('password_chage_was_not_requested'),
                        successText: t('password_change_requested'),
                        errorCallBack: () => setLoading(false),
                        successCallback: () => {
                          setLoading(false);
                          navigation.navigate('VerificationCodeStep', {username: values.username});
                        },
                      });
                    }}
                    text={t('login.forgotPasswordScreen.firstButton')}
                  />
                  <Text
                    testID="already-code-button"
                    enabled={values.username}
                    onPress={() => {
                      if (values.username) {
                        navigation.navigate('VerificationCodeStep', {username: values.username});
                      }
                    }}
                  >
                    {t('i_already_have_a_verification_code')}
                  </Text>
                </ButtonContainer>
              </KeypboardAvoidingContainer>
            </SafeScrollView>
          </>
        )}
      </Formik>
    </Container>
  );
};

export default ForgotPassword;
