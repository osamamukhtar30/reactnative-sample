import React from 'react';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';

const Container = styled.TouchableOpacity`
  margin-right: 3px;
  padding: 12px;
`;

const BurguerIcon = styled.View`
  width: ${wp(7)}px;
  max-width: ${hp(0.3) * 12}px;
`;

const BurguerIconLine = styled.View`
  height: ${hp(0.3)}px;
  width: 100%;
  margin: ${hp(0.3)}px 0px;
  background-color: ${({theme}) => theme.colors.white};
`;

const BurguerMenu = () => {
  const navigation = useNavigation();

  return (
    <Container onPress={() => navigation.openDrawer()}>
      <BurguerIcon>
        <BurguerIconLine />
        <BurguerIconLine />
        <BurguerIconLine />
      </BurguerIcon>
    </Container>
  );
};

export default BurguerMenu;
