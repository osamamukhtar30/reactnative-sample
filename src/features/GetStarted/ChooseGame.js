import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ReactNative, {Dimensions, FlatList} from 'react-native';
import {
  GAME_ID_LOL,
  GAME_ID_FORTNITE,
  GAME_ID_HEARTHSTONE,
  GAME_ID_COD_WARZONE,
  GAME_ID_FIFA,
  GAME_ID_COD_VANGUARD,
  GAME_ID_CSGO,
  GAME_ID_NBA,
  GAME_ID_MADDEN,
  GAME_ID_FIFA_23,
  GAME_ID_NBA_23,
  GAME_ID_MADDEN_23,
  GAME_ID_COD_MW2,
  GAME_ID_COD_WARZONE_2,
  GAME_ID_ROCKET_LEAGUE,
  GAME_ID_STREET_FIGHTER_5,
} from '@duelme/js-constants/dist/games';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useDispatch, useSelector} from 'react-redux';
import {selectAllGames} from '@duelme/apisdk/dist/slices/games/selectors';
import styled from 'styled-components/native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {selectGame} from '@duelme/apisdk/dist/slices/games/native';

import {DubbzLogoHeader} from '../../components/DubbzLogoHeader';
import {Container} from '../../components/Container';
import BackgroundImage from '../../components/background/BackgroundImage';
import {HeadTitle, HeadTitleWhite} from '../Signup/components/FormView.styles';
import BottomBackArrow from '../../components/BottomBackArrow';
import CarouselComponent from '../../components/Carousel/Carousel';

import {GAME_LOGOS} from './../../constants/images';

const BackgroundImageGame = styled.ImageBackground`
  width: 100%;
  height: 70%;
  position: absolute;
  bottom: 0;
`;

const InnerView = styled.View`
  border-radius: 10px;
  border-width: 1px;
  border-color: red;
  align-self: center;
  width: 80%;
  height: 80%;
  align-items: center;
  justify-content: center;
`;

const OutViewAndroid = styled.View`
  margin-left: ${({firstItem}) => (firstItem ? wp(25) : 10)}px;
  margin-right: 10px;
  align-self: center;
  width: ${wp(55)}px;
  height: ${wp(55)}px;
  padding: ${wp(5)}px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 10px;
`;

const InnerViewAndroid = styled.TouchableOpacity`
  border-radius: 10px;
  border-width: 1px;
  width: 100%;
  height: 100%;
  border-color: red;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 60%;
  height: 60%;
  align-self: center;
`;

const FlatListContainer = styled.View`
  width: 100%;
`;

const BACKGROUND_IMAGES = {
  [GAME_ID_LOL]: require('../../assets/GameCharacters/LOL.webp'),
  [GAME_ID_FORTNITE]: require('../../assets/GameCharacters/FORTNITE.webp'),
  [GAME_ID_HEARTHSTONE]: require('../../assets/GameCharacters/HEARTHSTONE.webp'),
  [GAME_ID_COD_WARZONE]: require('../../assets/GameCharacters/COD_WARZONE.webp'),
  [GAME_ID_FIFA]: require('../../assets/GameCharacters/FIFA.webp'),
  [GAME_ID_COD_VANGUARD]: require('../../assets/GameCharacters/COD_VANGUARD.webp'),
  [GAME_ID_CSGO]: require('../../assets/GameCharacters/CSGO.webp'),
  [GAME_ID_NBA]: require('../../assets/GameCharacters/NBA.webp'),
  [GAME_ID_MADDEN]: require('../../assets/GameCharacters/MADDEN.webp'),
  [GAME_ID_FIFA_23]: require('../../assets/GameCharacters/FIFA_23.webp'),
  [GAME_ID_NBA_23]: require('../../assets/GameCharacters/NBA_23.webp'),
  [GAME_ID_MADDEN_23]: require('../../assets/GameCharacters/MADDEN_23.webp'),
  [GAME_ID_COD_MW2]: require('../../assets/GameCharacters/COD_MW_2.webp'),
  [GAME_ID_COD_WARZONE_2]: require('../../assets/GameCharacters/COD_WARZONE_2.webp'),
  [GAME_ID_ROCKET_LEAGUE]: require('../../assets/GameCharacters/ROCKET_LEAGUE.webp'),
  [GAME_ID_STREET_FIGHTER_5]: require('../../assets/GameCharacters/STREET_FIGHTER_5.webp'),
};

export default function ChooseGame() {
  const [t] = useTranslation('global');
  const games = useSelector(selectAllGames);
  const [gamesValue, setGamesValue] = useState([]);
  const [selectedGame, setSelectedGame] = useState('1');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const FILTERED_BACKGROUND_IMAGES = [];

  for (let i = 0; i < games.length; i++) {
    FILTERED_BACKGROUND_IMAGES[i] = BACKGROUND_IMAGES[games[i].id];
  }

  useFocusEffect(
    useCallback(() => {
      if (games) {
        setGamesValue(
          games.map(game => {
            return {logo: GAME_LOGOS[game?.name]};
          }),
        );
      }
    }, [games]),
  );

  const _renderItem = ({item}) => {
    return (
      <InnerView>
        <Logo resizeMode="contain" source={item.logo}></Logo>
      </InnerView>
    );
  };

  const _renderItemAndroid = ({item, index}) => {
    return (
      <OutViewAndroid firstItem={index === 0}>
        <InnerViewAndroid
          onPress={() => {
            dispatch(selectGame(games[index].id));
            navigation.navigate('LinkAccount');
          }}
        >
          <Logo resizeMode="contain" source={item.logo}></Logo>
        </InnerViewAndroid>
      </OutViewAndroid>
    );
  };

  const onViewCallBack = React.useCallback(viewableItems => {
    if (viewableItems.viewableItems.length !== 0) {
      setSelectedGame(String(viewableItems.viewableItems[0].index + 1));
    }
  }, []);

  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  return (
    <Container>
      <BackgroundImage url={require('../../assets/Backgrounds/background2.webp')} />
      <DubbzLogoHeader />
      <BackgroundImageGame
        imageStyle={{
          resizeMode: 'cover',
          height: '100%',
        }}
        source={FILTERED_BACKGROUND_IMAGES[selectedGame - 1]}
      ></BackgroundImageGame>
      <BottomBackArrow
        onBack={() => {
          navigation.goBack();
        }}
      />
      <HeadTitle includeFontPadding={false}>{t('choose')}</HeadTitle>
      <HeadTitleWhite includeFontPadding={false}>{t('yourGame')}</HeadTitleWhite>
      {gamesValue.length > 0 && (
        <>
          {ReactNative.Platform.OS === 'ios' ? (
            <CarouselComponent
              onSnapToItem={index => {
                setSelectedGame(String(index + 1));
              }}
              useBlur={ReactNative.Platform.OS === 'ios'}
              containerCustomStyle={{marginTop: '15%'}}
              layout={'default'}
              data={gamesValue}
              sliderWidth={Dimensions.get('screen').width}
              itemWidth={190}
              itemHeight={190}
              onPress={index => {
                dispatch(selectGame(games[index].id));
                navigation.navigate('LinkAccount');
              }}
              renderItem={_renderItem}
            />
          ) : (
            <FlatListContainer>
              <FlatList
                onViewableItemsChanged={onViewCallBack}
                viewabilityConfig={viewConfigRef.current}
                initialNumToRender={3}
                data={gamesValue}
                renderItem={_renderItemAndroid}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              />
            </FlatListContainer>
          )}
        </>
      )}
    </Container>
  );
}
