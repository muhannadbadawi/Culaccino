import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import MainStackNavigator from "./MainStackNavigator"

export default function App() {
  return (
    <NavigationContainer>
      <MainStackNavigator />
      <StatusBar style='dark' />
    </NavigationContainer>
  );
}
