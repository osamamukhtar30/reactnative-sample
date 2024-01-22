import React from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import EmptyState from '../../../components/EmptyState/EmptyState';

const Image = styled.Image`
  width: ${wp(40)}px;
`;

const RequestsEmptyState = () => {
  const [t] = useTranslation('global');

  return (
    <EmptyState
      disableTopMargin
      background="green"
      innerContent={<Image resizeMode="contain" source={require('../../../assets/empty/icons/requests.webp')} />}
      titleRowOne={t('requestsEmptyState.you_dont_have')}
      titleRowTwo={t('requestsEmptyState.friend_requests')}
      info={t('requestsEmptyState.friend_requests_will_be_listed_here')}
    />
  );
};

export default RequestsEmptyState;
