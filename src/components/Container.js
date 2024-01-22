import React from 'react';
import styled from 'styled-components/native';
import ReactNative, {KeyboardAvoidingView, View, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import DrawerHeader from './../components/DrawerHeader/DrawerHeader';
import Bottom from './../components/background/Bottom';
import Top from './../components/background/Top';

export const Container = props => {
  return (
    <View
      testID={props.testID ? props.testID : 'container'}
      style={{
        height: '100%',
        flex: 1,
      }}
    >
      {props.children}
    </View>
  );
};

const StyledSafeScrollView = ({
  useRef,
  testID,
  children,
  refreshControl,
  disableBottomInset,
  disableTopInset,
  style = {},
}) => {
  const insets = useSafeAreaInsets();

  let localStyle = {
    ...style,
  };

  if (ReactNative.Platform.OS === 'android') {
    if (!disableBottomInset) {
      localStyle['paddingBottom'] = hp(20) + insets.top;
    }
    if (!disableTopInset) {
      localStyle['paddingTop'] = hp(15) + insets.top;
    }
  }

  return (
    <ScrollView
      testID={testID}
      ref={useRef}
      refreshControl={refreshControl}
      contentOffset={{y: hp(-15)}}
      contentContainerStyle={localStyle}
      contentInset={{top: disableTopInset ? 0 : hp(10) + insets.top, bottom: disableBottomInset ? 20 : 140}}
    >
      {children}
    </ScrollView>
  );
};
export const KeypboardAvoidingContainer = props => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView keyboardVerticalOffset={ReactNative.Platform.OS === 'ios' ? 0 : 50} behavior="position">
        {props.children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export const SafeScrollView = styled(StyledSafeScrollView)`
  flex-grow: 1;
`;

export const ContainerWithTabBar = props => {
  return (
    <Container testID="container-with-tabbar">
      <DrawerHeader />
      {props.children}
      <Top />
      <Bottom />
    </Container>
  );
};
