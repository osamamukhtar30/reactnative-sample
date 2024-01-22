import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';

import {Container, KeypboardAvoidingContainer} from '../../components/Container';
import Spacer from '../../components/Spacer/Spacer';
import BottomBackArrow from '../../components/BottomBackArrow';
import {DubbzLogoHeader} from '../../components/DubbzLogoHeader';
import BackgroundImage from '../../components/background/BackgroundImage';
import {HeadTitle, HeadTitleWhite} from '../Signup/components/FormView.styles';

import LinkAccountForm from './components/LinkAccountForm';

const LinkAccount = () => {
  const navigation = useNavigation();
  const [t] = useTranslation('global');
  return (
    <Container>
      <BackgroundImage></BackgroundImage>
      <ScrollView>
        <KeypboardAvoidingContainer>
          <Spacer height={5} />
          <DubbzLogoHeader />
          <BottomBackArrow onBack={() => navigation.goBack()} />
          <HeadTitle>{t('linkAccount.screenTitle1')}</HeadTitle>
          <HeadTitleWhite>{t('linkAccount.screenTitle2')}</HeadTitleWhite>
          <LinkAccountForm useScroll={false} />
        </KeypboardAvoidingContainer>
        <Spacer height={10} />
      </ScrollView>
    </Container>
  );
};

export default LinkAccount;
