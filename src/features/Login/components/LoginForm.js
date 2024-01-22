import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import CustomTextInput from '../../../components/Inputs/TextInput';
import Button from '../../../components/button/Button';
import theme from '../../../global-styles/theme';
import Oauth, {OrSeparator} from '../../../components/Oauth/Oauth';

const ForgotPasswordText = styled(Text)`
  color: ${theme.colors.white};
  font-size: 14px;
`;

const ForgotPasswordContainer = styled.View`
  align-items: flex-end;
  margin-top: ${hp('1%')}px;
`;

const SignInButtonView = styled.View`
  margin-top: ${hp('5%')}px;
  overflow: visible;
  align-items: center;
  justify-content: center;
  height: 60px;
`;

export default function LoginForm({handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, loading}) {
  const [t] = useTranslation('global');
  const navigation = useNavigation();

  return (
    <View style={{overflow: 'visible', paddingBottom: 100}}>
      <CustomTextInput
        testID="usernameInput"
        value={values.username}
        label={t('username')}
        onChangeText={handleChange('username')}
        handleBlur={handleBlur('username')}
        isInvalid={!!errors.username}
        feedback={touched.username && errors.username}
      />
      <CustomTextInput
        testID="passwordInput"
        value={values.password}
        label={t('password')}
        secureTextEntry={true}
        onChangeText={handleChange('password')}
        handleBlur={handleBlur('password')}
        isInvalid={!!errors.password}
        feedback={touched.password && errors.password}
      />
      <ForgotPasswordContainer>
        <ForgotPasswordText
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}
        >
          {t('login.forgotPassword')}?
        </ForgotPasswordText>
      </ForgotPasswordContainer>
      <SignInButtonView>
        <Button
          loading={loading}
          testID={!isValid || Object.keys(errors).length !== 0 ? 'disabledLoginButton' : 'enabledLoginButton'}
          disabled={!isValid || Object.keys(errors).length !== 0}
          text={t('login.login')}
          onPress={() => {
            if (values.username && values.password) {
              handleSubmit();
            } else {
              alert('Please, complete username and password fields');
            }
          }}
        />
      </SignInButtonView>
      <OrSeparator />
      <Oauth />
    </View>
  );
}
