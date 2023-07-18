import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Alert, Text, FlatList, Button, Dimensions, ImageBackground, TextInput, StyleSheet, Pressable, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';

const baseUrl = "http://192.168.100.5:5000/api/";
const Tab = createBottomTabNavigator();


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
  // style={homeStyles.container}
  return (

    <SafeAreaView>
      <View>
        <Text>Menu</Text>
        <Text style={homeStyles.titleName}>Name</Text>
        <Text style={homeStyles.titlePrice}>Price</Text>
        
        <FlatList style={homeStyles.listName}
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Text>
              {item.name},
            </Text>
          )}
        />
        <FlatList style={homeStyles.listPrice}
          data={data}
          keyExtractor={({ id }) => id}
          renderItem={({ item }) => (
            <Text>
              {item.price}JD
            </Text>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function CartScreen() {
  return (
    <SafeAreaView>
      <Text>Cart!</Text>
    </SafeAreaView>
  );
}
function ProfileScreen() {
  const [emailShare, setEmailShare] = useState('');
  const [nameShare, setNameShare] = useState('');
  const [idShare, setIdShare] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('name')
      .then((itemValue) => {
        setNameShare(itemValue);
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
    <ImageBackground source={require('./assets/img1.jpg')} resizeMode="cover" style={singupStyles.container}>
      <Pressable style={singupStyles.container1}>
        <Text style={singupStyles.Lable}>Name</Text>
        <TextInput keyboardType='default' style={singupStyles.Input} onChangeText={newText => setNameShare(newText)}>{nameShare}</TextInput>

        <Text style={singupStyles.Lable}>Email</Text>
        <TextInput keyboardType='email-address' style={singupStyles.Input} onChangeText={newText => setEmailShare(newText.toString())}>{emailShare}</TextInput>
      </Pressable>

    </ImageBackground>
  );
}

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
    <ImageBackground source={require('./assets/img3.jpg')} resizeMode="cover" style={loginStyles.container}>
      <Text style={loginStyles.UsernameLable}>Email</Text>
      <TextInput keyboardType='email-address' style={loginStyles.inputUsername} onChangeText={newText => setEmail(newText.toString())}></TextInput>

      <Text style={loginStyles.PasswordLable}>Password</Text>
      <TextInput secureTextEntry={true} keyboardType='visible-password' style={loginStyles.inputPassword} onChangeText={newText => setPassword(newText.toString())}></TextInput>
      <Pressable style={loginStyles.signupButton} onPress={() => navigation.navigate("Register")}  >

        <Text style={loginStyles.text}>Register</Text>

      </Pressable>
      {/* onPress={() => navigation.navigate("Customer")} */}
      <Pressable style={loginStyles.loginButton} onPress={loginCusomer}>

        <Text style={loginStyles.text}>Login</Text>

      </Pressable>
    </ImageBackground>
  );
}
//End Login


//Start Register
function Register() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const registerCusomer = () => {
    console.log("Loading ....");
    if ({ password }.password == { confirmPassword }.confirmPassword) {
      const postData = {
        name: name,
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
          console.log({ name });
          console.log(responseData);
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
    <ImageBackground source={require('./assets/img1.jpg')} resizeMode="cover" style={singupStyles.container}>
      <Pressable style={singupStyles.container1}>
        <Text style={singupStyles.Lable}>Name</Text>
        <TextInput keyboardType='default' style={singupStyles.Input} onChangeText={newText => setName(newText)}></TextInput>

        <Text style={singupStyles.Lable}>Phone Number</Text>
        <TextInput keyboardType='phone-pad' style={singupStyles.Input} onChangeText={newText => setEmail(newText.toString())}></TextInput>

        <Text style={singupStyles.Lable}>Email</Text>
        <TextInput keyboardType='email-address' style={singupStyles.Input} onChangeText={newText => setEmail(newText.toString())}></TextInput>

        <Text style={singupStyles.Lable}>Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={singupStyles.Input} onChangeText={newText => setPassword(newText.toString())}></TextInput>

        <Text style={singupStyles.Lable}>Confirm Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={singupStyles.Input} onChangeText={newText => setConfirmPassword(newText.toString())}></TextInput>



        <Pressable style={singupStyles.Button} onPress={registerCusomer}>

          <Text style={singupStyles.text}>Register</Text>

        </Pressable>
        <Pressable style={singupStyles.Button} onPress={() => navigation.navigate("Login")} >

          <Text style={singupStyles.text}>I Have an account</Text>

        </Pressable>
      </Pressable>

    </ImageBackground>
  )
}
//End Register


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
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Logout" component={LogoutCusomer} />
    </Tab.Navigator>


  )
}
//End Customer


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


const singupStyles = StyleSheet.create({
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
    color:"#fff",
    textAlign: 'left',
    marginBottom: 15,
    marginLeft: 15,
  },
  Input: {
    backgroundColor: '#ffd',
    width: "100%",
    height: "7%",
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
const loginStyles = StyleSheet.create({
  signupButton: {
    position: 'absolute',
    top: 470,
    left: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: '#fff',
  },
  loginButton: {
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
  },

  container: {
    flex: 1,
  },

  UsernameLable: {
    position: 'absolute',
    top: 300,
    left: 50,
    color: "#fff",
    fontSize: 15,
    textAlign: 'left'
  },
  inputUsername: {
    position: 'absolute',
    top: 325,
    left: 45,
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    borderRadius: 10,
    padding: 10,
    fontSize: 20
  },
  PasswordLable: {
    position: 'absolute',
    top: 380,
    left: 50,
    color: "#fff",
    fontSize: 15,
    textAlign: 'left'
  },
  inputPassword: {
    position: 'absolute',
    top: 405,
    left: 45,
    backgroundColor: '#fff',
    width: 300,
    height: 50,
    borderRadius: 10,
    padding: 10,
    fontSize: 20

  },

});
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
const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  titleName:{
    position:'relative',
    top:"12%",
    left:0
  },
  titlePrice:{
    position:'relative',
    top:"0%",
    left:"50%"
  },
  listName:{
    position:'relative',
    top:"30%",
    left:0
  },
  listPrice:{
    position:'relative',
    top:"0%",
    left:"50%"
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});
