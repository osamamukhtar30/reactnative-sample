import {ethers} from 'ethers';
import {POLYGON_NETWORK_ID, CHAIN_RPC} from 'react-native-dotenv';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const getSignerFromConnector = async ({connector, handleNetworkChanged}) => {
  const localProvider = new WalletConnectProvider({
    rpc: {
      [parseInt(POLYGON_NETWORK_ID)]: CHAIN_RPC,
    },
    chainId: parseInt(POLYGON_NETWORK_ID),
    connector: connector,
    qrcode: false,
  });
  await localProvider.enable();
  localProvider.on('chainChanged', chain => handleNetworkChanged(chain, localProvider));
  const ethersProvider = new ethers.providers.Web3Provider(localProvider);
  const localSigner = ethersProvider.getSigner();
  return localSigner;
};
