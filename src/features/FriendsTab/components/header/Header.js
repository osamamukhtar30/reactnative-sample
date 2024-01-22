import React from 'react';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import theme from '../../../../global-styles/theme';
import SearchBar from '../../../../components/searchBar/SearchBar';

import {HeaderContainer, BackButtonContainer, TitleContainer, SearchButtonContainer, TitleText} from './Header.styles';

const Header = ({searchMode, setSearchMode, keyword, setKeyword}) => {
  const [t] = useTranslation('global');
  const navigation = useNavigation();
  return (
    <HeaderContainer>
      {searchMode && (
        <BackButtonContainer onPress={() => (searchMode ? setSearchMode(false) : navigation.goBack)}>
          <IconFontisto name="arrow-left" size={16} color={theme.colors.white} />
        </BackButtonContainer>
      )}
      <TitleContainer>
        {searchMode ? <SearchBar value={keyword} setValue={setKeyword} /> : <TitleText>{t('friends.title')}</TitleText>}
      </TitleContainer>
      <SearchButtonContainer
        onPress={() => {
          setSearchMode(!searchMode);
        }}
      >
        <IconIonicons name="ios-search" size={25} color={theme.colors.white} />
      </SearchButtonContainer>
    </HeaderContainer>
  );
};

export default Header;
