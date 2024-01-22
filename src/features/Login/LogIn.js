import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {loginUser, setAccessToken} from '@duelme/apisdk/dist/slices/account/thunks';
import {fetchUserTokens, addUserToken} from '@duelme/apisdk/dist/slices/tokens/thunks';
import {Formik} from 'formik';
import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import * as yup from 'yup';

import useSyncEndpointCall from '../../utils/syncEndpointCall';
import {DubbzLogoHeader} from '../../components/DubbzLogoHeader';
import {Container, KeypboardAvoidingContainer} from '../../components/Container';
import BackgroundImage from '../../components/background/BackgroundImage';
import Spacer from '../../components/Spacer/Spacer';

import LoginFooter from './components/LoginFooter';
import LoginForm from './components/LoginForm';

const validationSchema = yup.object().shape({
  username: yup.string().required().min(1),
  password: yup.string().required().min(1),
});

const InputContainer = styled.View`
  margin-left: ${wp('7%')}px;
  margin-right: ${wp('7%')}px;
  overflow: visible;
`;

export default function LogIn() {
  const navigation = useNavigation();
  const [t] = useTranslation('global');
  const syncEndpointCall = useSyncEndpointCall();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const submitLogin = async values => {
    setLoading(true);
    await syncEndpointCall({
      avoidOpenLoading: true,
      avoidCloseLoading: true,
      loadingText: t('login.logging_in'),
      reduxAction: loginUser({username: values.username.toLowerCase(), password: values.password}),
      errorText: t('You were not logged in'),
      avoidToast: response => {
        if (response?.payload?.message === 'email_not_verified') {
          // Avoid toast message if the email is not verified
          return true;
        }
      },
      successText: null,
      successCallback: async () => {
        await dispatch(setAccessToken());
        let response = await dispatch(fetchUserTokens());
        let tokens = response?.payload;
        let token = await messaging().getToken();
        if (tokens && !tokens.includes(token)) {
          dispatch(addUserToken({token}));
        }
        setLoading(false);
      },
      errorCallBack: async response => {
        await dispatch(setAccessToken());
        setLoading(false);
        if (response?.payload?.message === 'email_not_verified') {
          navigation.navigate('VerificationCodeStep', {
            username: values.username,
            password: values.password,
            mode: 'VERIFICATION',
          });
        }
      },
    });
  };

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={submitLogin}
      validationSchema={validationSchema}
      validateOnMount={true}
    >
      {({isValid, handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <Container>
          <BackgroundImage />
          <KeypboardAvoidingContainer>
            <Spacer height={8} />
            <DubbzLogoHeader />
            <Spacer height={8} />
            <InputContainer>
              <LoginForm
                loading={loading}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                values={values}
                errors={errors}
                touched={touched}
                isValid={isValid}
              />
              {/*<OtherWayLogin />*/}
            </InputContainer>
          </KeypboardAvoidingContainer>
          <LoginFooter />
        </Container>
      )}
    </Formik>
  );
}
