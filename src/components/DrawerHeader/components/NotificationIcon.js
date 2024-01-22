import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import theme from './../../../global-styles/theme';

const NotificationContainer = styled.TouchableOpacity``;

const Circle = styled.View`
  height: ${wp(2.5)}px;
  width: ${wp(2.5)}px;
  border-radius: 360px;
  background-color: ${({theme}) => theme.colors.green};
  position: absolute;
  right: 2%;
  top: 2%;
`;

const NotificationIcon = ({onPress, hasNew}) => {
  return (
    <NotificationContainer onPress={onPress}>
      <Icon name={'bell'} color={theme.colors.grey} type="solid" size={hp(4.5) > wp(8) ? wp(8) : hp(4.5)} />
      {hasNew && <Circle />}
    </NotificationContainer>
  );
};

export default NotificationIcon;
