import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import LogIn from '../LogIn';
import ForgotPassword from '../forgotpassword/ForgotPassword';
import VerificationCodeStep from '../forgotpassword/VerificationCodeStep';

const drawerScreenStyle = {
  height: 0,
};

const Stack = createStackNavigator();

function StackLogin() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen options={drawerScreenStyle} name="Login" component={LogIn} />
      <Stack.Screen options={drawerScreenStyle} name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen options={drawerScreenStyle} name="VerificationCodeStep" component={VerificationCodeStep} />
    </Stack.Navigator>
  );
}

export default StackLogin;
