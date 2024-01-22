import styled from 'styled-components/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import theme from '../../../../global-styles/theme';

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom-color: ${theme.colors.primaryLight};
  border-bottom-width: 2px;
  padding: ${hp('2%')}px ${wp('0%')}px;
`;

export const BackButtonContainer = styled.TouchableOpacity`
  position: absolute;
  left: ${wp('5%')}px;
`;

export const TitleContainer = styled.View`
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 70%;
`;

export const SearchButtonContainer = styled.TouchableOpacity`
  position: absolute;
  right: ${wp('5%')}px;
`;

export const TitleText = styled.Text`
  font-weight: bold;
  font-size: ${wp('4%')}px;
  padding: 4px;
  color: ${theme.colors.white};
`;
