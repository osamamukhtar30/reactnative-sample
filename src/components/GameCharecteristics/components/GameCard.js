import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
import {selectGameById} from '@duelme/apisdk/dist/slices/games/selectors';
import {selectGameAccountByGameId} from '@duelme/apisdk/dist/slices/gameAccounts/selectors';
import LinearGradient from 'react-native-linear-gradient';
import {selectGame} from '@duelme/apisdk/dist/slices/games/native';
import {useNavigation} from '@react-navigation/native';
import {
  GAME_ID_MADDEN_23,
  GAME_ID_NBA_23,
  GAME_ID_MADDEN,
  GAME_ID_NBA,
  GAME_ID_FORTNITE,
  GAME_ID_HEARTHSTONE,
} from '@duelme/js-constants/dist/games';

import BlurViewContainer from '../../BlurViewContainer/BlurViewContainer';
import Button from '../../button/Button';

import theme from './../../../global-styles/theme';
import {GAME_ACCOUNT_SUMMARY_CARDS_ASSETS} from './../../../constants/images';

const StatTitle = styled.Text`
  color: white;
  font-size: ${wp(2)}px;
  font-weight: bold;
  width: 100%;
  font-family: 'Quantico';
  align-self: center;
  text-align: center;
  flex-grow: 1;
`;
const StatValue = styled.Text`
  color: white;
  font-size: ${wp(8)}px;
  font-family: GothamNarrow-Bold;
  width: 80%;
  align-self: center;
  text-align: center;
`;

const GameTitle = styled.Text`
  width: 90%;
  color: white;
  font-size: ${wp(8)}px;
  font-family: GothamNarrow-Bold;
`;
const TitleContainer = styled.View`
  left: 15px;
  top: 15px;
  width: 90%;
  position: absolute;
  color: white;
  font-size: ${wp(8)}px;
  font-weight: bold;
`;
const GameSubtitle = styled.Text`
  color: white;
  font-size: ${wp(5)}px;
  font-family: Quantico-Bold;
`;
const Container = styled(LinearGradient)`
  height: ${wp(120)}px;
  width: ${wp(80)}px;
  margin: 50px ${wp(2)}px;
  align-self: center;
  border-radius: ${hp(3)}px;
  overflow: hidden;
`;

const Image = styled.Image`
  position: absolute;
  height: 100%;
  width: 100%;
  top: ${hp(8)}px;
  bottom: 0px;
  right: 0px;
  left: 0px;
`;

const FULL_WIDTH_GAME_IDS = [
  GAME_ID_MADDEN_23,
  GAME_ID_NBA_23,
  GAME_ID_MADDEN,
  GAME_ID_NBA,
  GAME_ID_FORTNITE,
  GAME_ID_HEARTHSTONE,
];

const CharacterImage = styled(Image)`
  top: ${-hp(10)}px;
  height: 150%;
  width: 150%;
  left: -25%;
  ${({gameId}) =>
    FULL_WIDTH_GAME_IDS.includes(gameId) &&
    `
    top: ${hp(1)}px;
    height: 100%;
    width: 100%;
    left: 0%;
  `}
`;

const OutContainer = styled.View`
  margin-top: auto;
  height: ${wp(20) + 60 * 2}px;
`;

const StatsContainer = styled.View`
  width: 100%;
  padding: 0px 20px;
  margin-top: 20px;
  height: ${wp(20)}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const ButtonContainer = styled.View`
  width: 90%;
  margin-top: 20px;
`;
const StatContainer = styled.View`
  border-radius: ${hp(2.8)}px;
  border-width: 1px;
  border-color: white;
  width: 20%;
  height: 100%;
  margin: 0px 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 0px;
  align-items: center;
`;
const InnerView = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameCard = ({gameId}) => {
  const [t] = useTranslation('global');
  const game = useSelector(state => selectGameById(state, gameId));
  const gameAccount = useSelector(state => selectGameAccountByGameId(state, gameId));
  const cardAssets = GAME_ACCOUNT_SUMMARY_CARDS_ASSETS[game.name];
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <Container testID="game-card" colors={['#2d3a68', '#54a8e8']} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
      <Image source={cardAssets.smokeEffect} />
      <CharacterImage gameId={game.id} resizeMode="contain" source={cardAssets.image} />
      <TitleContainer>
        <GameTitle adjustsFontSizeToFit numberOfLines={1}>
          {game.name.replaceAll('_', ' ')}
        </GameTitle>
        <GameSubtitle>{t('gameStats.statistics')}</GameSubtitle>
      </TitleContainer>
      <OutContainer>
        <BlurViewContainer borderRadius={hp(3)}>
          <InnerView>
            <StatsContainer blurType={'light'}>
              <StatContainer>
                <StatTitle>{t('gameStats.lvl')}</StatTitle>
                <StatValue testID="account-level" adjustsFontSizeToFit numberOfLines={1}>
                  {gameAccount.accountLevel}
                </StatValue>
              </StatContainer>
              <StatContainer>
                <StatTitle>{t('gameStats.winRate')}</StatTitle>
                <StatValue testID="win-rate" adjustsFontSizeToFit numberOfLines={1}>
                  {gameAccount.winRate}
                </StatValue>
              </StatContainer>
              <StatContainer>
                <StatTitle>{t('gameStats.wins')}</StatTitle>
                <StatValue testID="won-games" adjustsFontSizeToFit numberOfLines={1}>
                  {gameAccount.wonGames}
                </StatValue>
              </StatContainer>
              <StatContainer>
                <StatTitle>{t('gameStats.losses')}</StatTitle>
                <StatValue testID="lost-games" adjustsFontSizeToFit numberOfLines={1}>
                  {gameAccount.lostGames}
                </StatValue>
              </StatContainer>
              <StatContainer>
                <StatTitle>{t('gameStats.matches')}</StatTitle>
                <StatValue testID="total-games" adjustsFontSizeToFit numberOfLines={1}>
                  {gameAccount.totalGames}
                </StatValue>
              </StatContainer>
            </StatsContainer>
            <ButtonContainer>
              <Button
                onPress={() => {
                  dispatch(selectGame(gameId));
                  navigation.navigate('PlayNow');
                }}
                solidColor={theme.colors.red}
                fullWidth
                text={t('tabBar.playNow')}
              />
            </ButtonContainer>
          </InnerView>
        </BlurViewContainer>
      </OutContainer>
    </Container>
  );
};

export default GameCard;
