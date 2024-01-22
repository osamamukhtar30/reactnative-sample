import {openModal} from '@duelme/apisdk/dist/slices/modal/native';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

const SOCKET_HANDLED_NOTIFICATIONS = ['FRIENDSHIP_REQUEST'];

export default class NotificationService {
  static initializeNotifications(navigation, dispatch, userId) {
    this.navigation = navigation;
    this.dispatch = dispatch;
    this.userId = userId;
    this.requestUserPermission();

    messaging().onNotificationOpenedApp(notification => {
      this.handleNavigation(notification);
    });
    messaging()
      .getInitialNotification()
      .then(notification => {
        this.handleNavigation(notification);
      });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      this.handleForgroundNotification(remoteMessage);
    });
    return unsubscribe;
  }
  static async requestUserPermission() {
    messaging().requestPermission();
  }
  static handleNavigation(remoteNotification) {
    if (remoteNotification && remoteNotification.data.userId === this.userId) {
      if (remoteNotification.data.type === 'PENDING_ACCEPT_MATCHMAKING_MATCH_STATUS') {
        this.navigation.navigate('PlayNow');
      } else if (
        remoteNotification.data.type === 'SCORE_REPORTED' ||
        remoteNotification.data.type === 'IN_DISPUTE' ||
        remoteNotification.data.type === 'Issue_Reported'
      ) {
        this.navigation.navigate('MatchView', {matchId: remoteNotification.data.matchId});
      } else if (
        remoteNotification.data.type === 'TOURNAMENT_UPDATED' ||
        remoteNotification.data.type === 'TOURNAMENT_STARTED'
      ) {
        this.navigation.navigate('TournamentsTab', {
          tournamentId: remoteNotification.data.tournamentId,
          initialTab: 1,
        });
      } else if (
        remoteNotification.data.type === 'QUICK_CHALLENGE_OFFER' ||
        remoteNotification.data.type === 'DEPOSIT_SUCCESSFUL' ||
        remoteNotification.data.type === 'DEPOSIT_UNDERPAID' ||
        remoteNotification.data.type === 'WITHDRAW_SUCCESSFUL' ||
        remoteNotification.data.type === 'WITHDRAW_ERROR'
      ) {
        this.dispatch(openModal('notifications'));
      } else if (remoteNotification.data.type === 'REFEREE_CHAT_MESSAGE') {
        this.navigation.navigate('FriendsTab');
      } else if (remoteNotification.data.type === 'FRIENDSHIP_REQUEST') {
        this.navigation.navigate('FriendsTab', {initialTab: 2});
      }
    }
  }
  static handleForgroundNotification(remoteNotification) {
    if (
      remoteNotification.data.userId === this.userId &&
      !SOCKET_HANDLED_NOTIFICATIONS.includes(remoteNotification.data.type)
    ) {
      Toast.show({
        type: 'info',
        text1: remoteNotification.notification?.title,
        text2: remoteNotification.notification?.body,
        onPress: () => this.handleNavigation(remoteNotification),
      });
    }
  }
}
