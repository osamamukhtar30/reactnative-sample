import React from 'react';
import styled from 'styled-components/native';
import {Text} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import theme from '../../../global-styles/theme';

const Container = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  width: 100%;
  top: ${`${hp('90%')}px}`};
`;
const StyledText = styled(Text)`
  color: ${theme.colors.paradisePink};
  font-weight: bold;
  font-size: 16px;
`;

const LoginFooter = () => {
  const [t] = useTranslation('global');
  const navigation = useNavigation();
  return (
    <Container>
      <StyledText style={{color: theme.colors.white}}>{t('login.notHaveAccount')} </StyledText>
      <StyledText onPress={() => navigation.navigate('Signup')}>{t('login.signUp')}</StyledText>
    </Container>
  );
};

export default LoginFooter;
