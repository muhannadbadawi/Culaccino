import { View, Text } from 'react-native';

import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseUrl = "http://192.168.100.5:5000/api/";


// Import required modules and components

function Logout({ navigation }) {
    const logoutCustomer = async () => {
      try {
        await AsyncStorage.removeItem("id");
        await AsyncStorage.removeItem("name");
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("phone");
        navigation.navigate("Login");
      } catch (error) {
        console.error('Error removing items from AsyncStorage:', error);
      }
    };
  
    useEffect(() => {
      logoutCustomer();
    }, []);
  
    return (
      <View>
        <Text>Logging out...</Text>
      </View>
    );
  }
  
  export default Logout;
