import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import ReactNative, {Keyboard, LayoutAnimation, Platform} from 'react-native';
import {useStyles} from 'react-styles-hook';
import {Button as ButtonPaper} from 'react-native-paper';
import Icon from 'react-native-fontawesome-pro';
import LinearGradient from 'react-native-linear-gradient';
import {BubblesLoader} from 'react-native-indicator';
import {widthPercentageToDP} from 'react-native-responsive-screen';

import theme from '../../global-styles/theme';

const BUTTON_HEIGHT = 60;

const Container = styled.TouchableOpacity`
  justify-content: center;
  height: ${BUTTON_HEIGHT}px;
  background-color: rgba(10, 10, 10, 0);
  ${({fullWidth}) =>
    fullWidth
      ? 'width: 100%;'
      : `
    align-self: center;
  `}
  overflow: visible;
  margin: 5px 0px;
`;

const LocalContainer = styled.View`
  height: 100%;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 100%;
`;

const ButtonPaperContainer = styled.View`
  ${({fullWidth}) =>
    fullWidth
      ? `
    width: 100%;
  `
      : `
    align-self: center;
  `}
  margin: 8px 0px;
`;

const ButtonTitle = styled.Text`
  color: ${({theme, disabled}) => (disabled ? theme.colors.grey : theme.colors.white)};
  text-align: center;
  text-transform: uppercase;
  font-style: normal;
  line-height: 21px;
  width: 100%;
  letter-spacing: 2px;
  flex-wrap: nowrap;
  font-family: 'Decimal-Medium';
  padding-horizontal: 20px;
`;

const styles = useStyles({
  fullWidth: {
    width: '100%',
  },
  button: {
    fontFamily: 'Decimal-Medium',
  },
  buttonBorder: {
    borderRadius: 3,
    borderColor: theme.colors.red,
    borderWidth: 1,
  },
});

const IconContainer = styled.View`
  position: absolute;
  right: 5%;
  top: 0px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DisabledOverlay = styled.View`
  border-radius: 5px;
  padding-horizontal: 5px;
  min-width: 50%;
  ${({disabled}) => disabled && `background-color: rgba(0, 0, 0, 0.5)`};
`;

const Button = ({
  testID,
  text,
  onPress = () => {},
  buttonStyle = {},
  disabled = false,
  fullWidth = false,
  mode = 'contained',
  icon,
  solidColor,
  darkText,
  borderColor,
  textColor,
  contentStyle = {},
  secondaryColors,
  loading = false,
}) => {
  useEffect(() => {
    if (ReactNative.Platform.OS === 'ios') {
      LayoutAnimation.easeInEaseOut();
    }
  }, [loading]);
  if (!solidColor) {
    return (
      <Container
        testID={testID}
        fullWidth={fullWidth}
        onPress={() => {
          Keyboard.dismiss();
          onPress();
        }}
        disabled={disabled}
      >
        <LinearGradient
          colors={
            secondaryColors
              ? [secondaryColors[0], secondaryColors[1]]
              : [theme.colors.saffron, theme.colors.paradisePink]
          }
          start={{x: 1, y: 0}}
          style={{borderRadius: 5}}
        >
          <DisabledOverlay disabled={disabled}>
            <LocalContainer icon={icon} mode={mode}>
              {loading ? (
                <BubblesLoader
                  dotRadius={Platform.isPad ? widthPercentageToDP('5.8%') * 0.15 : widthPercentageToDP('10.8%') * 0.15}
                  color={theme.colors.white}
                  size={Platform.isPad ? widthPercentageToDP('3.8%') : widthPercentageToDP('6.8%')}
                />
              ) : (
                <ButtonTitle adjustsFontSizeToFit numberOfLines={1} disabled={disabled}>
                  {text}
                </ButtonTitle>
              )}
            </LocalContainer>
          </DisabledOverlay>
        </LinearGradient>
      </Container>
    );
  }

  const buttonStyles = [styles.button, buttonStyle];
  const localContentStyle = [
    {
      paddingTop: loading ? 1.9 : 10,
      paddingBottom: loading ? 1.9 : 10,
    },
    contentStyle,
  ];
  const labelStyle = [
    {
      fontFamily: 'Decimal-Medium',
    },
  ];

  if (mode !== 'text') {
    buttonStyles.push(styles.buttonBorder);
  }

  if (fullWidth) {
    buttonStyles.push(styles.fullWidth);
  } else {
    localContentStyle.push({paddingLeft: 100, paddingRight: 100});
  }

  if (!disabled) {
    if (solidColor) {
      buttonStyles.push({
        borderColor: borderColor ? borderColor : solidColor,
        backgroundColor: solidColor,
      });
    }
    if (darkText) {
      labelStyle.push({
        color: theme.colors.black,
      });
    }
    if (textColor) {
      labelStyle.push({
        color: textColor,
      });
    }
  } else {
    if (solidColor) {
      buttonStyles.push({
        borderColor: `#0000006F`,
        backgroundColor: `${solidColor}8F`,
      });
    }
    if (borderColor) {
      buttonStyles.push({
        borderColor: `${borderColor}8F`,
        backgroundColor: solidColor,
      });
      labelStyle.push({
        color: `${borderColor}8F`,
      });
    }
  }

  return (
    <ButtonPaperContainer fullWidth={fullWidth}>
      <ButtonPaper
        testID={testID}
        mode="contained"
        contentStyle={localContentStyle}
        style={buttonStyles}
        labelStyle={labelStyle}
        disabled={disabled}
        onPress={() => {
          Keyboard.dismiss();
          onPress();
        }}
      >
        {loading ? (
          <BubblesLoader
            dotRadius={Platform.isPad ? widthPercentageToDP('5.8%') * 0.15 : widthPercentageToDP('10.8%') * 0.15}
            color={theme.colors.white}
            size={Platform.isPad ? widthPercentageToDP('3.8%') : widthPercentageToDP('6.8%')}
          />
        ) : (
          text
        )}
      </ButtonPaper>
      {icon && (
        <IconContainer>
          <Icon name={icon} color={borderColor} type="light" size={20} />
        </IconContainer>
      )}
    </ButtonPaperContainer>
  );
};

export default Button;
