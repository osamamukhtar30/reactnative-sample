import {useWalletConnect} from '@walletconnect/react-native-dapp';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {selectGameById} from '@duelme/apisdk/dist/slices/games/selectors';
import {acceptChallenge, declineQuickInvite} from '@duelme/apisdk/dist/slices/quickActions/thunks';
import {acceptFriendRequest, rejectFriendRequest} from '@duelme/apisdk/dist/slices/friendships/thunks';
import {GAME_NAMES} from '@duelme/js-constants/dist/games';
import {CURRENCY_LABELS} from '@duelme/js-constants/dist/wallets';
import {openModal, closeModal} from '@duelme/apisdk/dist/slices/modal/native';
import {selectCompletedTutorials} from '@duelme/apisdk/dist/slices/tutorial/selectors';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {selectExternalWalletAddress} from '@duelme/apisdk/dist/slices/externalWallet/selectors';
import {walletConnected, walletDisconnected} from '@duelme/apisdk/dist/slices/externalWallet/native';
import {displayLoading} from '@duelme/apisdk/dist/slices/loading/native';
import {selectFeatureFlags} from '@duelme/apisdk/dist/slices/featureFlags/selectors';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';
import ReactNative from 'react-native';
import {
  POLYGON_NETWORK_ID,
  CHAIN_RPC,
  CHAIN_NAME,
  CHAIN_CURRENCY_NAME,
  CHAIN_CURRENCY_SYMBOL,
  CHAIN_CURRENCY_DECIMALS,
  CHAIN_EXPLORER_URL,
} from 'react-native-dotenv';
import ExternalWalletService from '@duelme/apisdk/dist/services/ExternalWalletService';
import {ethers} from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const useAnyPaymentMethodEnabled = () => {
  const featureFlags = useSelector(selectFeatureFlags);
  const circleEnabled = featureFlags.circleEnabled && ReactNative.Platform.OS !== 'ios';
  const paypalEnabled = featureFlags.paypalEnabled;
  const anyPaymentMethodEnabled = circleEnabled || paypalEnabled;

  return anyPaymentMethodEnabled;
};

export const useNotificationText = notification => {
  let title, description, loadingText, denyLoadingText;

  let acceptHandler = () => {};
  let denyHandler = () => {};

  const [t] = useTranslation('global');

  const {
    amount,
    currency,
    gameId,
    type,
    // invitationCode,
    // privateMatchId,
    // lobbyId,
    usernameFrom,
  } = notification;

  const game = useSelector(state => selectGameById(state, gameId));

  const handleAcceptPrivateMatchInvitation = declineQuickInvite(notification.id);
  // TODO: Redirect to private match view with invitationCode

  const handleAcceptLobbyInvitation = declineQuickInvite(notification.id);
  // TODO: Redirect to lobby view with invitationCode

  const handleAcceptChallenge = acceptChallenge(notification.id);

  const handleAcceptFriendship = acceptFriendRequest(notification.id);

  if (type === 'QUICK_LOBBY_INVITATION') {
    description = t('notifications.lobbyDescription', {
      gameName: GAME_NAMES[game.name],
      usernameFrom: usernameFrom,
    });
    title = t('notifications.lobbyTitle');
    loadingText = t('notifications.acceptingLobby');
    denyLoadingText = t('notifications.denyingLobby');
    denyHandler = declineQuickInvite(notification.id);
    acceptHandler = handleAcceptLobbyInvitation;
  } else if (type === 'QUICK_PRIVATE_MATCH_INVITATION') {
    description = t('notifications.privateMatchDescription', {
      gameName: GAME_NAMES[game.name],
      usernameFrom: usernameFrom,
    });
    title = t('notifications.privateMatchTitle');
    loadingText = t('notifications.acceptingPrivateMatch');
    denyLoadingText = t('notifications.denyingPrivateMatch');
    denyHandler = declineQuickInvite(notification.id);
    acceptHandler = handleAcceptPrivateMatchInvitation;
  } else if (type === 'QUICK_CHALLENGE_INVITATION') {
    description = t('notifications.quickChallengeDescription', {
      gameName: GAME_NAMES[game.name],
      usernameFrom: usernameFrom,
      amount: amount,
      currency: CURRENCY_LABELS[currency],
    });
    title = t('notifications.quickChallengeTitle');
    loadingText = t('notifications.acceptingChallenge');
    denyLoadingText = t('notifications.denyingChallenge');
    denyHandler = declineQuickInvite(notification.id);
    acceptHandler = handleAcceptChallenge;
  } else if (type === 'FRIENDSHIP_INVITATION') {
    description = t('notifications.friendRequestDescription', {
      usernameFrom: usernameFrom,
    });
    title = t('notifications.friendRequestTitle');
    loadingText = t('notifications.acceptingFriendRequest');
    denyLoadingText = t('notifications.denyingFriendRequest');
    denyHandler = rejectFriendRequest(notification.id);
    acceptHandler = handleAcceptFriendship;
  }

  return {title, description, acceptHandler, denyHandler, loadingText, denyLoadingText};
};

export const useShowRules = feature => {
  const dispatch = useDispatch();
  const completedTutorials = useSelector(selectCompletedTutorials);
  return () => {
    return new Promise(resolve => {
      if (completedTutorials.includes(`${feature}Rules`)) {
        resolve(true);
      } else {
        dispatch(
          openModal('rules', {
            resolve: () => resolve(true),
            feature,
          }),
        );
      }
    });
  };
};

export const useHasSignedAddress = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const walletAddress = useSelector(selectExternalWalletAddress);

  return () => {
    return new Promise(resolve => {
      if (walletAddress === currentUser?.externalWallet?.cryptoAddress) {
        resolve(true);
      } else {
        dispatch(
          openModal('signAddress', {
            walletAddress: walletAddress,
            successCallback: () => resolve(true),
            failCallback: () => resolve(false),
          }),
        );
      }
    });
  };
};

const WALLETS_WITHOUT_RPC_RESPONSE = ['Trust Wallet'];

export const useConnectExternalWallet = () => {
  const connector = useWalletConnect();
  const dispatch = useDispatch();
  const [t] = useTranslation('global');

  return async () => {
    dispatch(displayLoading({display: true, text: t('connecting_to_blockchain')}));
    try {
      await connector.connect();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: t('there_was_an_error_connecting_your_wallet'),
      });
      try {
        connector.killSession();
      } catch (e) {
        // eslint-disable-next-line
        console.log(e);
      }
    }
    dispatch(displayLoading({display: false}));
  };
};

export const useHandleConnection = () => {
  const connector = useWalletConnect();
  const externalWalletAddress = useSelector(selectExternalWalletAddress);
  const dispatch = useDispatch();
  const [t] = useTranslation('global');

  let walletConnectProvider = null;
  let ethersProvider = null;
  let signer = null;

  const closeSession = async () => {
    connector.killSession();
    if (walletConnectProvider) {
      await walletConnectProvider.disconnect();
    }
    dispatch(walletDisconnected());
  };

  const updateChainCall = async () => {
    await connector.updateChain({
      chainId: ethers.utils.hexValue(parseInt(POLYGON_NETWORK_ID)),
      chainName: CHAIN_NAME,
      nativeCurrency: {
        name: CHAIN_CURRENCY_NAME,
        symbol: CHAIN_CURRENCY_SYMBOL,
        decimals: parseInt(CHAIN_CURRENCY_DECIMALS),
      },
      rpcUrls: [CHAIN_RPC],
      blockExplorerUrls: [CHAIN_EXPLORER_URL],
    });
  };

  const connectToPolygon = async () => {
    if (WALLETS_WITHOUT_RPC_RESPONSE.includes(connector?._peerMeta?.name)) {
      updateChainCall();
      await new Promise((resolve, reject) => {
        connector.on('wc_sessionUpdate', (error, payload) => {
          if (error) {
            reject(error);
          }
          if (payload.params[0].chainId === parseInt(POLYGON_NETWORK_ID)) {
            resolve();
          }
          reject('INCORRECT NETWORK');
        });
      });
    } else {
      await updateChainCall();
    }
    connector.session = {
      ...connector.session,
      chainId: parseInt(POLYGON_NETWORK_ID),
    };
    connector._setStorageSession();
  };

  const checkChain = async chainId => {
    if (parseInt(chainId) !== parseInt(POLYGON_NETWORK_ID)) {
      try {
        await new Promise((resolve, reject) => {
          dispatch(
            openModal('confirmScreen', {
              text: t('you_are_not_connected_to_the_correct_network'),
              handleBack: async () => {
                closeSession();
                dispatch(closeModal());
                reject();
              },
              backText: t('cancel'),
              continueText: t('connect_to_polygon'),
              handleContinue: async () => {
                await connectToPolygon();
                dispatch(closeModal());
                resolve();
              },
            }),
          );
        });
      } catch (e) {
        dispatch(displayLoading({display: false}));
        closeSession();
        throw e;
      }
    }
  };

  return async () => {
    if (connector.connected) {
      // The wallet is not connected
      if (!externalWalletAddress) {
        try {
          await checkChain(parseInt(connector.chainId));
          dispatch(displayLoading({display: true, text: t('connecting_to_blockchain')}));

          walletConnectProvider = new WalletConnectProvider({
            rpc: {
              [parseInt(POLYGON_NETWORK_ID)]: CHAIN_RPC,
            },
            chainId: parseInt(POLYGON_NETWORK_ID),
            connector: connector,
            qrcode: false,
          });

          await walletConnectProvider.enable();

          walletConnectProvider.on('chainChanged', checkChain);
          walletConnectProvider.on('disconnect', async () => {
            if (connector.connected) {
              connector.killSession();
            }
            if (walletConnectProvider) {
              await walletConnectProvider.disconnect();
            }
            dispatch(walletDisconnected());
          });

          ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);

          signer = ethersProvider.getSigner();

          await ExternalWalletService.init({
            signer,
            dispatch,
            callback: walletConnected,
            ethers,
          });
        } catch (e) {
          Sentry.captureException(e);
          Toast.show({
            type: 'error',
            text1: t('there_was_an_error_connecting_your_wallet'),
          });
          return;
        }
      }

      dispatch(displayLoading({display: false}));
    } else {
      dispatch(walletDisconnected());
    }
  };
};
