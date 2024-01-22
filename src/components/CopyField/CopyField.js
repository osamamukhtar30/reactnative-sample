import React, {useState} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';
import Clipboard from '@react-native-clipboard/clipboard';
import {useTranslation} from 'react-i18next';

import theme from './../../global-styles/theme';

const Container = styled.View`
  margin: 5px 0px;
  background-color: #ffffff20;
  border: 1px solid #ffffff60;
  width: 100%;
  border-radius: 25px;
  justify-content: center;
`;

const ScrollableContainer = styled.ScrollView`
  width: 80%;
  padding: 15px 0px;
  margin-left: 20px;
  margin-right: 10%;
  display: flex;
`;

const Text = styled.Text`
  text-align: center;
  color: ${({theme}) => theme.colors.white};
`;

const CopiedText = styled.Text`
  color: ${({theme}) => theme.colors.white};
`;

const CopiedContainer = styled.View`
  position: absolute;
  right: 20px;
  top: 5px;
  border-radius: 5px;
  padding: 0px 5px;
  background-color: ${({theme}) => theme.colors.primaryTournament};
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  width: 15%;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const CopyField = ({text}) => {
  const [t] = useTranslation('global');

  const [copied, setCopied] = useState(false);

  const handleCopied = () => {
    setCopied(true);
    Clipboard.setString(String(text));
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Container>
      <ScrollableContainer horizontal={true} contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <Text testID="copy-text">{text}</Text>
      </ScrollableContainer>
      {copied && (
        <CopiedContainer>
          <CopiedText>{t('copied')}</CopiedText>
        </CopiedContainer>
      )}
      <IconContainer testID="copy-button" onPress={handleCopied}>
        <Icon name={'copy'} color={theme.colors.white} type="light" size={18} />
      </IconContainer>
    </Container>
  );
};

export default CopyField;
