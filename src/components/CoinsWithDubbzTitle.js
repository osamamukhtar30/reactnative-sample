import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Text} from 'react-native-paper';
import IconMaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {selectUSDWallet} from '@duelme/apisdk/dist/slices/wallets/selectors';

import theme from '../global-styles/theme';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    paddingRight: wp('5%'),
    justifyContent: 'flex-end',
    left: Dimensions.get('screen').width - 230,
  },
  informationCoinsView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  moneyIcon: {
    color: theme.colors.red,
  },
  moneyText: {
    color: theme.colors.white,
    textAlign: 'right',
  },
  dubbzTitle: {
    width: '100%',
    color: theme.colors.red,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
    fontSize: wp('4%'),
  },
});

const CoinsWithDubbzTitle = () => {
  const wallet = useSelector(selectUSDWallet);

  return (
    <View style={styles.container}>
      <Text style={styles.dubbzTitle}>dubbz</Text>
      <View style={styles.informationCoinsView}>
        <IconMaterialIcon style={styles.moneyIcon} name="attach-money" size={18} />
        <Text style={styles.moneyText}>{wallet?.balance ? wallet.balance.toFixed(2) : 0.0}</Text>
      </View>
    </View>
  );
};

export default CoinsWithDubbzTitle;
