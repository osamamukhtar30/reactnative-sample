import React from 'react';
import styled from 'styled-components/native';
import {selectAllGames} from '@duelme/apisdk/dist/slices/games/selectors';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {selectGame} from '@duelme/apisdk/dist/slices/games/native';
import {BoxShadow} from 'react-native-shadow';
import Carousel from 'react-native-reanimated-carousel';
import {useSharedValue} from 'react-native-reanimated';
import ReactNative, {FlatList} from 'react-native';

import theme from '../../global-styles/theme';

const GameCardContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({theme}) => theme.colors.saffron}
  border-radius: ${wp(8)}px;
  border: 1px solid ${({theme}) => theme.colors.saffron};
`;

const CarouselContainer = styled.View`
  margin-top: ${wp(2)}px;
`;

const ImagesContainer = styled.View`
  border-radius: ${wp(8)}px;
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

const GameCard = styled.Image`
  width: 100%;
  height: 100%;
`;

const IMAGE_MAPPING = {
  1: require('./../../assets/games/cards/LOL.webp'),
  2: require('./../../assets/games/cards/HEARTHSTONE.webp'),
  3: require('./../../assets/games/cards/FORTNITE.webp'),
  4: require('./../../assets/games/cards/COD_VANGUARD.webp'),
  5: require('./../../assets/games/cards/FIFA_22.webp'),
  6: require('./../../assets/games/cards/COD_WARZONE.webp'),
  7: require('./../../assets/games/cards/CSGO.webp'),
  8: require('./../../assets/games/cards/NBA_2K22.webp'),
  9: require('./../../assets/games/cards/MADDEN_22.webp'),
  10: require('./../../assets/games/cards/FIFA_23.webp'),
  11: require('./../../assets/games/cards/NBA_2K23.webp'),
  12: require('./../../assets/games/cards/MADDEN_23.webp'),
  13: require('./../../assets/games/cards/COD_WARFARE_2.webp'),
  14: require('./../../assets/games/cards/COD_WARZONE_2.webp'),
  15: require('./../../assets/games/cards/ROCKET_LEAGUE.webp'),
  16: require('./../../assets/games/cards/STREET_FIGHTER_5.webp'),
};

const GameCardPureComponentContainer = styled.View`
  flex: 1;
`;

class GameCardPureComponent extends React.PureComponent {
  render() {
    const game = this.props.game;
    const dispatch = this.props.dispatch;
    const navigation = this.props.navigation;

    return (
      <GameCardPureComponentContainer testID="game-card">
        <BoxShadow
          key={game.id}
          setting={
            ReactNative.Platform.OS === 'android'
              ? {
                  width: wp(45) * 1.744,
                  height: wp(45),
                  color: theme.colors.saffron,
                  radius: wp(8),
                  border: 10,
                  opacity: 0.5,
                  style: {
                    marginLeft: 10,
                    marginRight: 10,
                    marginTop: 20,
                    marginBottom: 20,
                  },
                }
              : {
                  color: theme.colors.saffron,
                  radius: wp(8),
                  border: 10,
                  opacity: 0.5,
                  width: wp(100),
                  height: wp(60),
                  style: {
                    width: '100%',
                    height: '100%',
                  },
                }
          }
        >
          <GameCardContainer
            testID="card-button"
            onPress={() => {
              dispatch(selectGame(game.id));
              navigation.navigate('PlayNow');
            }}
          >
            <ImagesContainer>
              <GameCard source={IMAGE_MAPPING[game.id]} />
            </ImagesContainer>
          </GameCardContainer>
        </BoxShadow>
      </GameCardPureComponentContainer>
    );
  }
}

const GameCards = () => {
  let games = useSelector(selectAllGames);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const renderItem = ({item}) => {
    const game = item;
    if (!game.underMaintenance && game.included) {
      return <GameCardPureComponent game={game} dispatch={dispatch} navigation={navigation} />;
    }
    return <></>;
  };

  const progressValue = useSharedValue(0);

  return (
    <CarouselContainer testID="game-card-container">
      {ReactNative.Platform.OS === 'android' ? (
        <>
          {games.length !== 0 && (
            <FlatList
              snapToAlignment="start"
              initialNumToRender={2}
              data={games}
              decelerationRate={'fast'}
              snapToInterval={wp(45) * 1.744 + 20}
              renderItem={renderItem}
              style={{
                marginBottom: hp(2),
                marginTop: hp(1),
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <Carousel
          loop={true}
          ref={c => {
            this._carousel = c;
          }}
          snapEnabled={true}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          onProgressChange={(_, absoluteProgress) => (progressValue.value = absoluteProgress)}
          data={games}
          renderItem={renderItem}
          width={wp(100)}
          height={wp(60)}
        />
      )}
    </CarouselContainer>
  );
};

export default GameCards;
