import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from './screens/Login';
import Register from './screens/Register';
import Customer from './screens/Customer';
import Home from './screens/Home';
import Cart from './screens/Cart';
import Profile from './screens/Profile';
import Logout from './screens/Logout';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Customer' component={Customer} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name='Home' component={Home} />
        <Stack.Screen name='Cart' component={Cart} />
        <Stack.Screen name='Profile' component={Profile} />
        <Stack.Screen name='Logout' component={Logout} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
