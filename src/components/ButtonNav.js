import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import theme from '../global-styles/theme';

const styles = StyleSheet.create({
  buttonView: {
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  button: {
    backgroundColor: theme.colors.red,
    width: wp('85%'),
    height: 50,
    justifyContent: 'center',
  },
  buttonLabel: {
    color: theme.colors.white,
  },
});

const ButtonNav = props => {
  return (
    <View style={styles.buttonView}>
      <Button style={styles.button} labelStyle={styles.buttonLabel} onPress={() => props.nav()}>
        {props.buttonText}
      </Button>
    </View>
  );
};

export default ButtonNav;
