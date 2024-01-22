import React from 'react';
import {Text, View} from 'react-native';
import {useStyles} from 'react-styles-hook';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import theme from '../../global-styles/theme';

const styles = useStyles({
  buttonView: {
    borderRadius: 10,
    borderWidth: 3,
    borderColor: theme.colors.red,
    height: hp('6%'),
    width: wp('85%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
  },
});

const ButtonWithBorder = ({text = '', onPress = () => {}, buttonStyle = {}, textStyle = {}}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.buttonView, buttonStyle]}>
        <Text style={[styles.buttonText, textStyle]}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonWithBorder;
