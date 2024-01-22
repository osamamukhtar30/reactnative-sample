import React from 'react';
import styled from 'styled-components/native';
import {StyleSheet, View} from 'react-native';
import {Avatar} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import theme from '../global-styles/theme';

import ProText from './ProText/ProText';

const styles = StyleSheet.create({
  avatar: {
    flexDirection: 'row',
  },
  avatarImage: {
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.vividBlue,
  },
});

const Dot = styled.View`
  height: ${({imageSize}) => imageSize / 3}px;
  width: ${({imageSize}) => imageSize / 3}px;
  border: 2px solid ${({theme}) => theme.colors.primaryDarker}
  background-color: ${({theme, online}) => (online ? theme.colors.colorOnline : theme.colors.grey)};
  position: absolute;
  border-radius: ${wp('5%')}px;
  bottom: 0px;
  left: 0px;
`;

const AvatarProfile = ({imageSize, source, displayStatus, online, isPro}) => {
  return (
    <View>
      <View style={styles.avatarImage}>
        <Avatar.Image source={source} size={imageSize ? imageSize : wp('15%')} />
      </View>
      {displayStatus && <Dot imageSize={imageSize ? imageSize : wp('15%')} online={online} />}
      {isPro && <ProText />}
    </View>
  );
};

export default AvatarProfile;
