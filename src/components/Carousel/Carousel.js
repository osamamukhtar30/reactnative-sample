import React from 'react';
import Carousel from 'react-native-snap-carousel';
import styled from 'styled-components/native';

import BlurViewContainer from '../../components/BlurViewContainer/BlurViewContainer';

const CarouselComponent = props => {
  const Container = styled.View`
    border-radius: 10px;
    overflow: hidden;
  `;
  const InnerContainer = styled.TouchableOpacity`
    display: flex;
    border-radius: 10px;
    height: ${({height}) => height}px;
    justify-content: center;
    align-items: center;
  `;

  return (
    <Carousel
      removeClippedSubviews={false}
      {...props}
      renderItem={listProps => {
        return (
          <Container>
            <BlurViewContainer
              blurType={props.blurType ? props.blurType : 'ultraThinMaterialDark'}
              width={props.itemWidth}
              height={props.itemHeight}
            >
              <InnerContainer
                height={props.itemHeight}
                disabled={props.disabled}
                onPress={() => {
                  props.onPress && props.onPress(listProps.index);
                }}
              >
                {props.renderItem(listProps)}
              </InnerContainer>
            </BlurViewContainer>
          </Container>
        );
      }}
    />
  );
};

export default CarouselComponent;
