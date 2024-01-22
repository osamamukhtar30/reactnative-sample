import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {MATCH_TYPE_TO_GAME_SETTINGS} from '@duelme/js-constants/dist/games';
import {ScrollView} from 'react-native-gesture-handler';
import {selectGameAccountByGameId} from '@duelme/apisdk/dist/slices/gameAccounts/selectors';
import {selectSelectedGame} from '@duelme/apisdk/dist/slices/games/selectors';
import {useTranslation} from 'react-i18next';
import {findMatch, fetchRecommendation} from '@duelme/apisdk/dist/slices/matchmaking/thunks';

import {useCanPlayMatchApp} from '../../common/hooks/matches';
import theme from '../../global-styles/theme';
import Button from '../../components/button/Button';
import {SliderContainer} from '../../components/SliderContainer/SliderContainer';
import useSyncEndpointCall from '../../utils/syncEndpointCall';

import GameModeButtonList from './component/GameModeButtonList';

const ButtonsContainer = styled.View`
  margin-top: auto;
  flex-direction: row;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const ButtonContainer = styled.View`
  width: 45%;
`;

const WidthContainer = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
`;

const StyledScrollView = styled(ScrollView)``;

const GameMode = props => {
  const [loading, setLoading] = useState(false);
  const game = useSelector(selectSelectedGame);
  const {matchType, prizePool, entryFee, crossPlayEnabled} = props.route.params;
  const settings = MATCH_TYPE_TO_GAME_SETTINGS[matchType.name];
  const navigation = useNavigation();
  const selectedGameAccount = useSelector(state => selectGameAccountByGameId(state, game.id));
  const [t] = useTranslation('global');
  const dispatch = useDispatch();
  const canPlayMatchApp = useCanPlayMatchApp(game.id, navigation, true);

  const syncEndpointCall = useSyncEndpointCall();

  const handleFindMatch = async () => {
    const localFindMatch = async ({useExternalWallet}) => {
      setLoading(true);
      await syncEndpointCall({
        avoidOpenLoading: true,
        avoidCloseLoading: true,
        loadingText: t('getting_into_matchmaking'),
        reduxAction: findMatch({
          crossPlayEnabled,
          matchTypeId: matchType.id,
          gameAccountId: selectedGameAccount.id,
          bet: {currency: 'USD', amount: entryFee},
          useExternalWallet: useExternalWallet,
        }),
        successCallback: async () => {
          setLoading(false);
          dispatch(
            fetchRecommendation({
              gameId: game.id,
              regionId: selectedGameAccount.regionId,
              matchTypeId: matchType.id,
              platformName: selectedGameAccount.platformName,
              platformType: selectedGameAccount.platformType,
              currency: 'USD',
              amount: entryFee,
            }),
          );
          navigation.navigate('SearchOpponent');
        },
        errorCallBack: async () => {
          setLoading(false);
          navigation.navigate('Matchmaking');
        },
      });
    };

    await canPlayMatchApp({amount: entryFee}, localFindMatch);
  };

  return (
    <SliderContainer>
      <StyledScrollView testID="game-mode">
        <WidthContainer>
          <GameModeButtonList settings={settings} prizePool={prizePool} />
        </WidthContainer>
      </StyledScrollView>
      <ButtonsContainer>
        <ButtonContainer>
          <Button
            fullWidth
            solidColor="transparent"
            borderColor={theme.colors.white}
            onPress={() => {
              navigation.goBack();
            }}
            text={t('cancel')}
          />
        </ButtonContainer>
        <ButtonContainer>
          <Button
            loading={loading}
            fullWidth
            onPress={() => {
              handleFindMatch();
            }}
            text={t('find_match')}
          />
        </ButtonContainer>
      </ButtonsContainer>
    </SliderContainer>
  );
};

export default GameMode;
