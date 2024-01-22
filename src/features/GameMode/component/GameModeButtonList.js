import React from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import Icon from 'react-native-fontawesome-pro';
import {useTranslation} from 'react-i18next';
import {selectGameAccountByGameId} from '@duelme/apisdk/dist/slices/gameAccounts/selectors';
import {selectSelectedGameId, selectRegionById} from '@duelme/apisdk/dist/slices/games/selectors';

import theme from '../../../global-styles/theme';
import TextInput from '../../../components/Inputs/TextInput';

import {SETTING_TO_ICON} from './../../../constants/common';

const WidthContainer = styled.View`
  width: 80%;
  margin: 0px auto;
`;

const GameModeButtonList = ({settings, prizePool}) => {
  const [t] = useTranslation('global');
  const gameId = useSelector(selectSelectedGameId);
  const gameAccount = useSelector(state => selectGameAccountByGameId(state, gameId));
  const region = useSelector(state => selectRegionById(state, gameAccount?.regionId));

  return (
    <>
      <WidthContainer>
        {Object.keys(settings.preMatchSettings).map(setting => {
          return (
            <TextInput
              testID={`${setting}-value`}
              key={setting}
              editable={false}
              label={t(setting)}
              outLabel
              value={t(settings.preMatchSettings[setting])}
              pseudoBefore={
                <Icon name={SETTING_TO_ICON[setting]} color={theme.colors.transluscentWhite} type="solid" size={20} />
              }
            />
          );
        })}
        <TextInput
          testID="prize_pool-value"
          editable={false}
          label={t('prize_pool')}
          outLabel
          value={String(prizePool)}
          pseudoBefore={<Icon name="dollar-sign" color={theme.colors.transluscentWhite} type="solid" size={20} />}
        />
        <TextInput
          testID="region-value"
          editable={false}
          label={t('region')}
          outLabel
          value={region?.name}
          pseudoBefore={<Icon name="globe" color={theme.colors.transluscentWhite} type="solid" size={20} />}
        />
      </WidthContainer>
    </>
  );
};

export default GameModeButtonList;
