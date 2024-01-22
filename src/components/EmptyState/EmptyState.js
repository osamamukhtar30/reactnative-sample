import React from 'react';
import styled from 'styled-components/native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

const Image = styled.ImageBackground`
  margin-top: ${({disableTopMargin}) => (disableTopMargin ? 0 : -40)}px;
  width: ${wp(90)}px;
  height: ${wp(90)}px;
  max-width: ${hp(50)}px;
  max-height: ${hp(50)}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RedBackground = ({children, disableTopMargin}) => {
  return (
    <Image disableTopMargin={disableTopMargin} source={require('../../assets/empty/backgrounds/red.webp')}>
      {children}
    </Image>
  );
};

const GreenBackground = ({children, disableTopMargin}) => {
  return (
    <Image disableTopMargin={disableTopMargin} source={require('../../assets/empty/backgrounds/green.webp')}>
      {children}
    </Image>
  );
};

const PurpleBackground = ({children, disableTopMargin}) => {
  return (
    <Image disableTopMargin={disableTopMargin} source={require('../../assets/empty/backgrounds/purple.webp')}>
      {children}
    </Image>
  );
};

const GreyBackground = ({children, disableTopMargin}) => {
  return (
    <Image disableTopMargin={disableTopMargin} source={require('../../assets/empty/backgrounds/grey.webp')}>
      {children}
    </Image>
  );
};

const YellowBackground = ({children, disableTopMargin}) => {
  return (
    <Image disableTopMargin={disableTopMargin} source={require('../../assets/empty/backgrounds/yellow.webp')}>
      {children}
    </Image>
  );
};

const InnerContainer = styled.View`
  margin-top: -${wp(25)}px;
`;

const Container = styled.View`
  width: 100%;
  margin: auto 0px;
  z-index: ${({topComponent}) => (topComponent ? 1 : -1)};
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colors.white};
  text-align: center;
  font-weight: bold;
  font-size: ${wp(7)}px;
  line-height: ${wp(7.5)}px;
  font-family: Decimal-Bold;
`;

const Info = styled.Text`
  color: #ffffff;
  font-weight: 300;
  margin: auto;
  margin-top: 10px;
  text-align: center;
  max-width: 80%;
  font-family: Decimal-Medium;
`;

const ButtonContainer = styled.View`
  align-self: center;
  margin: auto;
  width: ${({halfSize}) => (halfSize ? '45%' : '100%')};
`;
const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 80%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const ImageContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const EmptyState = ({
  background,
  innerContent,
  titleRowOne,
  titleRowTwo,
  info,
  button,
  secondaryButton,
  disableTopMargin,
  topComponent = false,
  testID = 'empty-state',
}) => {
  const backgroundMapping = {
    red: RedBackground,
    green: GreenBackground,
    purple: PurpleBackground,
    grey: GreyBackground,
    yellow: YellowBackground,
  };

  const BackImage = backgroundMapping[background];

  return (
    <Container topComponent={topComponent} testID={testID}>
      <ImageContainer>
        <BackImage disableTopMargin={disableTopMargin}>{innerContent}</BackImage>
      </ImageContainer>
      <InnerContainer>
        {titleRowOne && <Title>{titleRowOne}</Title>}
        {titleRowTwo && <Title>{titleRowTwo}</Title>}
        {info && <Info>{info}</Info>}
        <ButtonsContainer>
          {button && <ButtonContainer halfSize={!!secondaryButton}>{button}</ButtonContainer>}
          {secondaryButton && <ButtonContainer halfSize={true}>{secondaryButton}</ButtonContainer>}
        </ButtonsContainer>
      </InnerContainer>
    </Container>
  );
};

export default EmptyState;
