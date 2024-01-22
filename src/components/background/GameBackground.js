import React from 'react';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {selectSelectedGameId} from '@duelme/apisdk/dist/slices/games/selectors';

import theme from './../../global-styles/theme';

const Container = styled.View`
  height: 100%;
  width: 100%;
  position: absolute;
  top: ${hp(3)}px;
  padding-top: ${({paddingTop}) => paddingTop}px;
`;

const Image = styled.Image`
  width: ${wp(100)}px;
  height: ${wp(100 * 1.53)}px;
`;

const BottomImageLinearGradient = styled(LinearGradient)`
  height: ${hp(20)}px;
  width: 100%;
  margin-top: -${hp(20)}px;
`;
const BottomImageLinearGradientDos = styled(LinearGradient)`
  height: ${hp(20)}px;
  width: 100%;
`;

const TopImageLinearGradient = styled(LinearGradient)`
  height: ${hp(20)}px;
  position: absolute;
  z-index: 2;
  width: 100%;
  margin-bottom: -${hp(5)}px;
`;

const COD_MW_2_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/COD_WARFARE_2.webp')} />;
};

const FIFA_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/FIFA.webp')} />;
};

const LOL_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/LOL.webp')} />;
};

const CSGO_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/CSGO.webp')} />;
};

const FORTNITE_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/FORTNITE.webp')} />;
};

const HEARTHSTONE_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/HEARTHSTONE.webp')} />;
};

const COD_WARZONE_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/COD_WARZONE.webp')} />;
};

const COD_VANGUARD_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/COD_VANGUARD.webp')} />;
};

const NBA_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/NBA.webp')} />;
};

const MADDEN_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/MADDEN.webp')} />;
};

const FIFA_23_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/FIFA_23.webp')} />;
};

const NBA_23_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/NBA_23.webp')} />;
};

const MADDEN_23_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/MADDEN_23.webp')} />;
};

const COD_WARZONE_2_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/COD_WARZONE_2.webp')} />;
};

const ROCKET_LEAGUE_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/ROCKET_LEAGUE.webp')} />;
};

const STREET_FIGHTER_BACKGROUND = () => {
  return <Image resizeMode="cover" source={require('../../assets/games/backgrounds/STREET_FIGHTER_5.webp')} />;
};

const GAME_ID_TO_BACKGROUND_MAPPING = {
  1: LOL_BACKGROUND,
  2: HEARTHSTONE_BACKGROUND,
  3: FORTNITE_BACKGROUND,
  4: COD_VANGUARD_BACKGROUND,
  5: FIFA_BACKGROUND,
  6: COD_WARZONE_BACKGROUND,
  7: CSGO_BACKGROUND,
  8: NBA_BACKGROUND,
  9: MADDEN_BACKGROUND,
  10: FIFA_23_BACKGROUND,
  11: NBA_23_BACKGROUND,
  12: MADDEN_23_BACKGROUND,
  13: COD_MW_2_BACKGROUND,
  14: COD_WARZONE_2_BACKGROUND,
  15: ROCKET_LEAGUE_BACKGROUND,
  16: STREET_FIGHTER_BACKGROUND,
};

const GameBackground = () => {
  const insets = useSafeAreaInsets();
  const gameId = useSelector(selectSelectedGameId);
  const Background = GAME_ID_TO_BACKGROUND_MAPPING[gameId];
  return (
    <Container paddingTop={insets.top}>
      <TopImageLinearGradient
        pointerEvents="none"
        colors={[theme.colors.darkPurple, theme.colors.darkPurple, 'transparent']}
      />
      <Background />
      <BottomImageLinearGradient colors={['transparent', theme.colors.darkPurple]} />
      <BottomImageLinearGradientDos colors={[theme.colors.darkPurple, 'transparent']} />
    </Container>
  );
};

export default GameBackground;
