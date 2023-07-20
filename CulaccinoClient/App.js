import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import Customer from './screens/Customer';
import HomeScreen from './screens/Home';
import CartScreen from './screens/Cart';
import ProfileScreen from './screens/Profile';
import LogoutScreen from './screens/Logout';

const baseUrl = "http://192.168.100.5:5000/api/";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='Customer' component={Customer} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Cart' component={CartScreen} />
          <Stack.Screen name='Profile' component={ProfileScreen} />
          <Stack.Screen name='Logout' component={LogoutScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
