import React from 'react';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon from 'react-native-fontawesome-pro';

const Container = styled.TouchableOpacity``;

const CloseIcon = ({onPress}) => {
  return (
    <Container onPress={onPress}>
      <Icon name={'xmark'} color="white" type="light" size={wp(8)} />
    </Container>
  );
};

export default CloseIcon;
