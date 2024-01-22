import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import {ContainerWithTabBar} from '../../components/Container';
import theme from '../../global-styles/theme';

import FindPlayer from './FindPlayer/FindPlayer';
import Requests from './Requests/Requests';
import Social from './Social/Social';

const Tab = createMaterialTopTabNavigator();

const Background = styled(LinearGradient)`
  flex: 1;
`;

const FriendsTab = props => {
  const insets = useSafeAreaInsets();
  const initialTab = props.route.params?.initialTab;
  const [t] = useTranslation('global');
  return (
    <ContainerWithTabBar>
      <Background colors={[theme.colors.trueBlue, theme.colors.darkPurple]} start={{x: 0, y: 0}} end={{x: 0.7, y: 0.9}}>
        <Tab.Navigator
          style={{marginTop: 40}}
          initialRouteName={!initialTab ? 'SOCIAL' : initialTab === 1 ? 'FindPlayer' : 'Requests'}
          sceneContainerStyle={{backgroundColor: 'transparent', paddingTop: 20}}
          screenOptions={{
            tabBarActiveTintColor: theme.colors.white,
            tabBarInactiveTintColor: theme.colors.grey,
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: 'bold',
              fontFamily: 'GothamNarrow-Bold',
            },
            tabBarStyle: {
              backgroundColor: 'transparent',
            },
            tabBarItemStyle: {
              borderColor: theme.colors.transluscentWhite,
              borderWidth: 1,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            },
            tabBarIndicatorStyle: {opacity: 0},
            tabBarContentContainerStyle: {
              marginTop: hp(10) + insets.top,
            },
          }}
        >
          <Tab.Screen
            name="SOCIAL"
            component={Social}
            options={{tabBarLabel: t('social'), cardStyle: {backgroundColor: 'transparent'}}}
          />
          <Tab.Screen
            name="FindPlayer"
            component={FindPlayer}
            options={{tabBarLabel: t('findPlayer'), cardStyle: {backgroundColor: 'transparent'}}}
          />
          <Tab.Screen
            name="Requests"
            component={Requests}
            options={{tabBarLabel: t('requests'), cardStyle: {backgroundColor: 'transparent'}}}
          />
        </Tab.Navigator>
      </Background>
    </ContainerWithTabBar>
  );
};

export default FriendsTab;
