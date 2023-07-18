import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, TouchableOpacity, Alert, Text, FlatList, Button, Dimensions, ImageBackground, TextInput, StyleSheet, Pressable, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';


const baseUrl = "http://192.168.100.5:5000/api/";
const Tab = createBottomTabNavigator();


//Start HomeScreen
function HomeScreen() {
  const [data, setData] = useState([])
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');


  const getData = {
    name: "",
    price: 0
  };
  useEffect(() => {
    fetch(baseUrl + "item/getAll").then((response) => response.json()).then((json) => setData(json)).catch((error) => alert(error))
  })


  const handlePress = (description) => {
    console.log("Pressed:", description);
    Alert.alert(description)
    // Additional logic here
  };
  // style={homeStyles.container}
  return (

    <SafeAreaView>

      <View style={homeStyles.container}>
        <View style={homeStyles.buttonContainer}>
          <Pressable>
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>Item Name</Text>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 2, marginBottom: "5%" }} />
            <FlatList
              data={data}
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => (
                <TouchableOpacity onLongPress={() => handlePress(item.description)} style={{ flexDirection: 'row' }}>
                  <Text style={{ marginLeft: "2%", marginBottom: "15%", fontWeight: "500", fontSize: 20 }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </View>
        <View style={homeStyles.buttonContainer}>
          <Pressable>
            <Text style={{ fontWeight: "bold", fontSize: 30 }}>Item Price</Text>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 2, marginBottom: "5%" }} />
            <FlatList
              data={data}
              keyExtractor={({ id }) => id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handlePress(item._id)} style={{ flexDirection: 'row' }}>
                  <Text style={{ marginLeft: "5%", marginBottom: "15%", marginRight: "20%", fontWeight: "500", fontSize: 20 }}>{item.price} JD</Text>
                  <Icon name="add-circle" size={24} color="tomato" />
                </TouchableOpacity>

              )}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
//End HomeScreen

//Start homeStyles
const homeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'center', // Center items horizontally
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1, // Each button container should take equal space
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
//End homeStyles


//Start CartScreen
function CartScreen() {
  return (
    <SafeAreaView>
      <Text>Cart!</Text>
    </SafeAreaView>
  );
}
//End CartScreen

//Start cartStyles
const cartStyles = StyleSheet.create({

});
//End cartStyles

//Start Profile
function ProfileScreen() {
  const [emailShare, setEmailShare] = useState('');
  const [nameShare, setNameShare] = useState('');
  const [phoneShare, setPhoneShare] = useState('');
  const [idShare, setIdShare] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('name')
      .then((itemValue) => {
        setNameShare(itemValue);
      })
      .catch((error) => {
        console.error('Error retrieving item:', error);
      });
    AsyncStorage.getItem('phone')
      .then((itemValue) => {
        setPhoneShare(itemValue);
      })
      .catch((error) => {
        console.error('Error retrieving item:', error);
      });
    AsyncStorage.getItem('email')
      .then((itemValue) => {
        setEmailShare(itemValue);
      })
      .catch((error) => {
        console.error('Error retrieving item:', error);
      });
    AsyncStorage.getItem('id')
      .then((itemValue) => {
        setIdShare(itemValue);
      })
      .catch((error) => {
        console.error('Error retrieving item:', error);
      });
  }, []);
  return (
    <ImageBackground source={require('./assets/img1.jpg')} resizeMode="cover" style={registerStyles.container}>
      <Pressable style={registerStyles.container1}>
        <Text style={registerStyles.Lable}>Name</Text>
        <TextInput keyboardType='default' style={registerStyles.Input} onChangeText={newText => setNameShare(newText)}>{nameShare}</TextInput>

        <Text style={registerStyles.Lable}>Email</Text>
        <TextInput keyboardType='email-address' style={registerStyles.Input} onChangeText={newText => setEmailShare(newText.toString())}>{emailShare}</TextInput>

        <Text style={registerStyles.Lable}>Phone Number</Text>
        <TextInput keyboardType='phone-pad' style={registerStyles.Input} onChangeText={newText => setPhoneShare(newText.toString())}>{phoneShare}</TextInput>

      </Pressable>

    </ImageBackground>
  );
}
//End Profile

//Start profileStyles
const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});
//End profileStyles

//Start Login
function Login() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const postData = {
    email: email,
    password: password
  };

  const loginCusomer = () => {
    console.log("Loading ....");
    const postData = {
      email: email,
      password: password
    };

    fetch(baseUrl + "people/getPerson", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers required by your API
      },
      body: JSON.stringify(postData) // Convert the data to JSON string
    })
      .then(response => response.json())
      .then(responseData => {
        // Handle the response data
        if (responseData.name != undefined) {
          AsyncStorage.setItem("name", responseData.name);
          AsyncStorage.setItem("id", responseData.id);
          AsyncStorage.setItem("email", responseData.email);
          AsyncStorage.setItem("phone", responseData.phone);
          console.log("Login successful");
          navigation.navigate("Customer")
        }
        else {
          Alert.alert("Wrong email or password")
        }
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      })

  }

  return (
    <ImageBackground source={require('./assets/img4.jpg')} resizeMode="cover" style={{ flex: 1 }}>

      <SafeAreaView style={loginStyles.container}>
        <Text style={loginStyles.lable}>Email</Text>
        <TextInput keyboardType='email-address' style={loginStyles.input} onChangeText={newText => setEmail(newText.toString())}></TextInput>

        <Text style={loginStyles.lable}>Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={loginStyles.input} onChangeText={newText => setPassword(newText.toString())}></TextInput>
        <View style={loginStyles.buttonsBox}>
          <Pressable style={loginStyles.buttonContainer} onPress={() => navigation.navigate("Register")}  >

            <Text style={loginStyles.buttonText}>Register</Text>

          </Pressable>
          <Pressable style={loginStyles.buttonContainer} onPress={loginCusomer}>

            <Text style={loginStyles.buttonText}>Login</Text>

          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
//End Login


//Start loginStyles
const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center items horizontally
    flexDirection: 'column',
    marginBottom: "20%"
  },
  lable: {
    textAlign: "left",
    color: 'black',
    fontSize: 20,
    fontWeight: "400",
    marginLeft: "7%",
    marginBottom: "2%",
    color: "#fff"
  },
  input: {
    width: "90%",
    height: "7%",
    borderRadius: 20,
    padding: "1%",
    marginHorizontal: "5%",
    paddingHorizontal: "5%",
    backgroundColor: "#fff",
    marginBottom: "2%",
    fontSize: 18
  },
  buttonsBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center', // Center items horizontally
    width: "40%",
    height: "32%",
    backgroundColor: "#fff",
    padding: "1%",
    borderRadius: 10,
    marginHorizontal: "5%"
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: "400"
  },



});
//End loginStyles

//Start Register
function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const registerCusomer = () => {
    console.log("Loading ....");
    if ({ password }.password == { confirmPassword }.confirmPassword) {
      const postData = {
        name: name,
        phone: phone,
        email: email,
        password: password
      };

      fetch(baseUrl + "people", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers required by your API
        },
        body: JSON.stringify(postData) // Convert the data to JSON string
      })
        .then(response => response.json())
        .then(responseData => {
          // Handle the response data
          console.log("Done");
          navigation.navigate("Login")
        })
        .catch(error => {
          // Handle any errors
          console.log({ name });
          console.error(error);
        });
    } else {
      console.log("confirmPassword != Password")
      console.log({ confirmPassword }.confirmPassword + "sas" + { password }.password)
    }
  }
  return (
    <ImageBackground source={require('./assets/img1.jpg')} resizeMode="cover" style={registerStyles.container}>
      <Pressable style={registerStyles.container1}>
        <Text style={registerStyles.Lable}>Name</Text>
        <TextInput keyboardType='default' style={registerStyles.Input} onChangeText={newText => setName(newText)}></TextInput>

        <Text style={registerStyles.Lable}>Email</Text>
        <TextInput keyboardType='email-address' style={registerStyles.Input} onChangeText={newText => setEmail(newText.toString())}></TextInput>

        <Text style={registerStyles.Lable}>Phone Number</Text>
        <TextInput keyboardType='phone-pad' style={registerStyles.Input} onChangeText={newText => setPhone(newText.toString())}></TextInput>

        <Text style={registerStyles.Lable}>Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={registerStyles.Input} onChangeText={newText => setPassword(newText.toString())}></TextInput>

        <Text style={registerStyles.Lable}>Confirm Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={registerStyles.Input} onChangeText={newText => setConfirmPassword(newText.toString())}></TextInput>



        <Pressable style={registerStyles.Button} onPress={registerCusomer}>

          <Text style={registerStyles.text}>Register</Text>

        </Pressable>
        <Pressable style={registerStyles.Button} onPress={() => navigation.navigate("Login")} >

          <Text style={registerStyles.text}>I Have an account</Text>

        </Pressable>
      </Pressable>

    </ImageBackground>
  )
}
//End Register

//Start registerStyles
const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    top: "7%",
    left: "2%",
    width: '95%',
    height: '82%',
    borderRadius: 50,
    backgroundColor: "#555",
    padding: 30,
    opacity: 0.9,
  },
  Lable: {
    fontSize: 18,
    color: "#fff",
    textAlign: 'left',
    marginBottom: 15,
    marginLeft: 15,
  },
  Input: {
    backgroundColor: '#ffd',
    width: "100%",
    height: "8%",
    borderRadius: 20,
    padding: "5%",
    fontSize: 20,
    marginBottom: "5%",
  },
  Button: {
    margin: 15,
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
    fontWeight: '500',
    letterSpacing: 0.25,
    color: '#000',
  },

});
//End registerStyles

//Start Customer
function Customer() {
  const navigation = useNavigation();

  const [data, setData] = useState([])
  const [value, setValue] = useState('');

  const LogoutCusomer = () => {

    useEffect(() => {
      // Function to remove item from AsyncStorage
      const removeItemFromStorage = async () => {
        try {
          await AsyncStorage.removeItem('name');
          console.log('Item removed from AsyncStorage.');
        } catch (error) {
          console.error('Error removing item from AsyncStorage:', error);
        }
      };

      // Call the function to remove the item
      removeItemFromStorage();
    }, []);
    useEffect(() => {
      // Function to remove item from AsyncStorage
      const removeItemFromStorage = async () => {
        try {
          await AsyncStorage.removeItem('email');
          console.log('Item removed from AsyncStorage.');
        } catch (error) {
          console.error('Error removing item from AsyncStorage:', error);
        }
      };

      // Call the function to remove the item
      removeItemFromStorage();
    }, []);
    useEffect(() => {
      // Function to remove item from AsyncStorage
      const removeItemFromStorage = async () => {
        try {
          await AsyncStorage.removeItem('id');
          console.log('Item removed from AsyncStorage.');
        } catch (error) {
          console.error('Error removing item from AsyncStorage:', error);
        }
      };

      // Call the function to remove the item
      removeItemFromStorage();
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
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




//Start App
export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='Customer' component={Customer} />
        </Stack.Group>
      </Stack.Navigator>
      <StatusBar style='dark' />
    </NavigationContainer>
  );
}
//End App







