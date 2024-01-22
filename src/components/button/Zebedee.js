import React from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';

const ButtonContainer = styled.TouchableOpacity`
  margin: 10px 0px;
  width: 90%;
`;

const Button = styled(LinearGradient)`
  padding: 20px 10px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const Text = styled.Text`
  color: ${({theme}) => theme.colors.white};
  margin-left: 5px;
  font-weight: bold;
`;

const ZebeDeeButton = ({onPress = () => {}}) => {
  const [t] = useTranslation('global');

  return (
    <ButtonContainer onPress={onPress}>
      <Button colors={['#f8191c', '#9569f4']} useAngle={true} angle={15}>
        <Text>{t('download')} ZEBEDEE</Text>
      </Button>
    </ButtonContainer>
  );
};

export default ZebeDeeButton;
