import { Dimensions, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import Cart from './Cart';
import Profile from './Profile';
import PreviousOrder from './PreviousOrder';

const Tab = createBottomTabNavigator();

const baseUrl = "http://192.168.100.5:5000/api/";

//Start Customer
function Customer() {
  const navigation = useNavigation();
  const LogoutCusomer = () => {
    useEffect(() => {
      const removeItemFromStorage = async (v) => {
        try {
          await AsyncStorage.removeItem(v);
          console.log(v + ' removed from AsyncStorage.');
        } catch (error) {
          console.error('Error removing item from AsyncStorage:', error);
        }
      };
      removeItemFromStorage("id");
      removeItemFromStorage("name");
      removeItemFromStorage("email");
      removeItemFromStorage("phone");
    }, []);
    navigation.navigate("Login")
  }


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'PreviousOrder') {
            iconName = focused ? 'archive' : 'archive-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Tab.Screen name="PreviousOrder" component={PreviousOrder} options={{ headerShown: false }} />
      <Tab.Screen name="Logout" component={LogoutCusomer} />
    </Tab.Navigator>


  )
}
//End Customer

//Start customerStyles
const customerStyles = StyleSheet.create({
  containter: {
    width: Dimensions.get("window").width, //for full screen
    height: Dimensions.get("window").height, //for full screen
  },
  s: {
    width: 100,
    height: 400
  },
  fixed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  scrollview: {
    backgroundColor: 'transparent',
    zIndex: 10
  },
  logoutButton: {
    position: 'absolute',
    top: 470,
    left: 220,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: 0.25,
    color: 'black',
  }
})
//End customerStyles

export default Customer;
