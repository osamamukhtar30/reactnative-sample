import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {useNavigation} from '@react-navigation/native';
import {selectExternalWallet} from '@duelme/apisdk/dist/slices/externalWallet/selectors';

const IconContainer = styled.TouchableOpacity`
  height: ${wp(8)}px;
  width: ${wp(8)}px;
  max-width: ${hp(5)}px;
  max-height: ${hp(5)}px;
  border: 1px solid ${({theme, walletConnected}) => (walletConnected ? theme.colors.green : theme.colors.red)};
  border-radius: ${wp(8)}px;
  padding: 5px;
  background-color: #121505;
`;

const Image = styled.Image`
  height: 100%;
  width: 100%;
`;

const WalletAddress = styled.Text`
  font-size: 10px;
  margin-top: 2px;
  color: ${({theme}) => theme.colors.white};
`;

const Container = styled.TouchableOpacity`
  right: ${wp(2)}px;
  border-radius: ${wp(3)}px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({walletConnected}) =>
    walletConnected &&
    `
    background-color: #121505;
    border: 1px solid #22242a;
  `}
`;

const ConnectWallet = () => {
  const connector = useWalletConnect();
  const navigation = useNavigation();
  const externalWallet = useSelector(selectExternalWallet);

  const clickFunction = externalWallet.isConnected
    ? () => {
        navigation.navigate('Wallet');
      }
    : () => {
        connector.connect();
      };

  return (
    <Container onPress={clickFunction} walletConnected={externalWallet.isConnected}>
      <IconContainer walletConnected={externalWallet.isConnected} onPress={clickFunction}>
        <Image
          resizeMode="contain"
          source={
            externalWallet.isConnected
              ? require('./../../assets/icons/wallet-connected.webp')
              : require('./../../assets/icons/wallet-disconnected.webp')
          }
        />
      </IconContainer>
      {externalWallet.isConnected && (
        <WalletAddress>
          {externalWallet.address.slice(externalWallet.address.length - 4, externalWallet.address.length)}
        </WalletAddress>
      )}
    </Container>
  );
};

export default ConnectWallet;
