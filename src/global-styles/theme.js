import {configureFonts, DefaultTheme} from 'react-native-paper';

const theme = {
  colors: {
    darkViolet: '#1C204B',
    violet: '#FF1DF5',
    redLight: '#ff717d',
    red: '#E4405E',
    redSemiTransparent: '#ff3848b8',
    redTransparent: '#ff3a4a36',
    yellow: '#F79D3A',
    yellowTransparent: '#cc9e2959',
    green: '#43F426',
    greenTransparent: '#019c6247',
    white: '#FFFAFA',
    black: '#0E0E0E',
    violetDark: '#7A30FF',
    violetLight: '#a775ff',
    blue: '#0638FF',
    chatUser: '#985EFF',
    transluscentWhite: 'rgba(255,255,255,0.6)',
    confirmGreen: '#0bd43a',
    chatOther: '#3A3051',
    grey: '#9599a4',
    greyishWhite: '#d2d0d5',
    greyLight: '#3a4256',
    greyTransparent: '#9599a420',
    primaryTournament: '#1d152b',
    primaryDarkest: '#201931',
    primaryDarker: '#241c36',
    primaryDark: '#281f3b',
    primaryNeutral: '#08122e',
    secondaryNeutral: '#450e19',
    primaryLight: '#403656',
    primaryLighter: '#5C4B82',
    homeText: '#382E4D',
    colorOnline: '#75d852',
    notifications: {
      info: '#ee7258',
      challenge: '#f53050',
    },
    violetLighter: '#d200dd',
    darkPurple: '#1C0F2F',
    trueBlue: '#2446CB',
    vividBlue: '#3BC5F6',
    paradisePink: '#E44053',
    saffron: '#F79D3A',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    bold: 700,
  },
  navbarOffset: '172px',
  breakpoints: {
    xs: {value: 0},
    sm: {value: 600},
    md: {value: 768},
    lg: {value: 992},
    xl: {value: 1200},
    xxl: {value: 1400},
  },
  fullView: 'calc(100vh - 172px)',
  fullViewNavOnly: 'calc(100vh - 80px)',
};
const fontConfig = {
  ios: {
    regular: {
      fontFamily: 'Decimal-Light',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Decimal-Light',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Decimal-Light',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Decimal-Light',
      fontWeight: 'normal',
    },
  },
};
export const paperTheme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: theme.colors.red,
    // TODO: Add the rest of the color themes
  },
  fonts: configureFonts(fontConfig),
};

export const transparentNavigatorTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default theme;
