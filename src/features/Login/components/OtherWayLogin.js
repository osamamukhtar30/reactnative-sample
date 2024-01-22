import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';

import theme from '../../../global-styles/theme';

const styles = StyleSheet.create({
  lineStyle: {
    borderBottomColor: '#121212',
    borderBottomWidth: 2,
    width: wp('25%'),
    margin: wp('4%'),
  },
  lineView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: hp('2%'),
  },
  otherSigninContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
    borderRadius: 5,
    marginTop: hp('3%'),
    flexDirection: 'row',
  },
});

const OtherWayLogin = () => {
  const [t] = useTranslation('global');
  return (
    <View>
      <View style={styles.lineView}>
        <View style={styles.lineStyle}></View>
        <Text style={{color: theme.colors.white}}>{t('login.connectUsing')}</Text>
        <View style={styles.lineStyle}></View>
      </View>
      <View style={styles.otherSigninContainer}>
        <Button
          mode="contained"
          icon="facebook"
          style={{
            alignItems: 'flex-start',
            width: wp('38%'),
            marginLeft: wp('3%'),
            padding: 4,
            backgroundColor: '#4D5DA8',
          }}
        >
          {t('login.button.facebook')}
        </Button>
        <Button
          mode="contained"
          icon="google"
          style={{
            marginLeft: wp('4%'),
            width: wp('38%'),
            padding: 4,
            backgroundColor: '#d34836',
          }}
        >
          {t('login.button.google')}
        </Button>
      </View>
    </View>
  );
};

export default OtherWayLogin;
