import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {selectCurrentUser} from '@duelme/apisdk/dist/slices/currentUser/selectors';
import {useSelector} from 'react-redux';
import {BASE_FE_URL} from 'react-native-dotenv';
import ReactNative, {Share} from 'react-native';

import Button from '../../../components/button/Button';
import EmptyState from '../../../components/EmptyState/EmptyState';
import Players from '../../../components/JoinDiscord/components/Players';
import theme from '../../../global-styles/theme';

const SocialEmptyState = () => {
  const [t] = useTranslation('global');
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser);
  const referralUrl = `${BASE_FE_URL}/register?referrer=${user.username}`;
  return (
    <EmptyState
      background="green"
      innerContent={<Players />}
      titleRowOne={t('socialEmptyState.you_dont_have')}
      titleRowTwo={t('socialEmptyState.friends_yet')}
      info={t('socialEmptyState.your_friends_will_be_listed_here')}
      button={
        <Button
          testID="find-button"
          onPress={() => navigation.navigate('FindPlayer')}
          solidColor="transparent"
          borderColor={theme.colors.white}
          text={t('socialEmptyState.find_friends')}
          fullWidth
        />
      }
      secondaryButton={
        <Button
          testID="invite-button"
          onPress={() =>
            Share.share(
              ReactNative.Platform.OS === 'ios'
                ? {url: referralUrl}
                : {title: t('referrer_code'), message: referralUrl},
            )
          }
          solidColor="transparent"
          borderColor={theme.colors.white}
          text={t('socialEmptyState.invite_friends')}
          fullWidth
        />
      }
    />
  );
};

export default SocialEmptyState;
