import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './screens/Login';
import Register from './screens/Register';
import Customer from './screens/Customer';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='Register' component={Register} />
                <Stack.Screen name='Customer' component={Customer} />

            </Stack.Group>
        </Stack.Navigator>
    );
};
export default StackNavigator;
