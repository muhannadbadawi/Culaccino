import { View, Text, Button, ImageBackground, TextInput, StyleSheet, Pressable, } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage';



const baseUrl = "http://192.168.100.5:5000/api/people/y";
const Login = () => {
  const navigation = useNavigation();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([])
  const [value, setValue] = useState('');

  const postData = {
    email: email,
    password: password
  };
  AsyncStorage.getItem("name").then((value) => {
    setValue(value);
  })
  console.log(value)

  const loginCusomer = () => {
    console.log("Loading ....");
    const postData = {
      email: email,
      password: password
    };

    fetch(baseUrl, {
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
        console.log(responseData);
        setData(responseData)
        AsyncStorage.setItem("name", data.name);
        AsyncStorage.setItem("id", data._id);
        AsyncStorage.setItem("email", data.email);
      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      })
      .finally(() => navigation.navigate("Customer"))
  }
  //
  return (
    <ImageBackground source={require('./../assets/img3.jpg')} resizeMode="cover" style={styles.container}>
      <Text>{value}</Text>
      <Text style={styles.UsernameLable}>Email</Text>
      <TextInput keyboardType='email-address' style={styles.inputUsername} onChangeText={newText => setEmail(newText.toString())}></TextInput>

      <Text style={styles.PasswordLable}>Password</Text>
      <TextInput secureTextEntry={true} keyboardType='visible-password' style={styles.inputPassword} onChangeText={newText => setPassword(newText.toString())}></TextInput>
      <Pressable style={styles.signupButton} onPress={() => navigation.navigate("Register")}  >

        <Text style={styles.text}>Register</Text>

      </Pressable>
      {/* onPress={() => navigation.navigate("Customer")} */}
      <Pressable style={styles.loginButton} onPress={loginCusomer}>

        <Text style={styles.text}>Login</Text>

      </Pressable>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
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

export default Login
