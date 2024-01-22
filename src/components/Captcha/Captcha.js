import React, {useRef, useCallback} from 'react';
import styled from 'styled-components/native';
import Recaptcha from 'react-native-recaptcha-that-works';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {REACT_APP_RECAPTCHA_SITE_KEY, REACT_APP_RECAPTCHA_URL} from 'react-native-dotenv';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-fontawesome-pro';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import theme from '../../global-styles/theme';
import Button from '../button/Button';

const Container = styled.View`
  margin: 20px 0px;
`;

const ErrorText = styled.Text`
  color: ${({theme}) => theme.colors.red};
`;

const Header = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  z-index: 1;
  top: ${({baseTop}) => baseTop + 5}px;
`;

const Captcha = ({setFieldValue, error, captchaResolved = false}) => {
  const size = 'normal';
  const $recaptcha = useRef();
  const [t] = useTranslation('global');
  const insets = useSafeAreaInsets();
  const handleOpenRecaptcha = useCallback(ref => {
    ref?.current?.open();
  }, []);

  const handleCloseRecaptcha = useCallback(ref => {
    ref?.current?.close();
  }, []);

  return (
    <Container>
      <Button
        testID="open-recaptcha-button"
        fullWidth
        solidColor={'transparent'}
        borderColor={theme.colors.white}
        disabled={captchaResolved}
        icon={captchaResolved ? 'check' : null}
        text={captchaResolved ? t('you_are_a_human') : t('captcha.button.open')}
        onPress={() => {
          if (process.env.JEST_WORKER_ID !== undefined) {
            // for testing purposes avoid actually opening recaptcha
            setFieldValue('TEST_RECAPTCHA_VALUE');
          } else {
            handleOpenRecaptcha($recaptcha);
          }
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Recaptcha
        ref={$recaptcha}
        lang="en"
        headerComponent={
          <Header baseTop={insets.top} onPress={() => handleCloseRecaptcha($recaptcha)}>
            <Icon name={'xmark'} color="white" type="light" size={wp(8)} />
          </Header>
        }
        siteKey={REACT_APP_RECAPTCHA_SITE_KEY}
        baseUrl={REACT_APP_RECAPTCHA_URL}
        size={size}
        theme="dark"
        onClose={() => handleCloseRecaptcha($recaptcha)}
        onError={error => {
          alert(error);
        }}
        onExpire={() => setFieldValue('')}
        onVerify={token => {
          setFieldValue(token);
        }}
      />
    </Container>
  );
};

export default Captcha;
