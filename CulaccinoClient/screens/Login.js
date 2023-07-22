import { View, Alert, Text, ImageBackground, TextInput, Pressable, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import md5 from 'md5';

const baseUrl = "http://192.168.1.166:5000/api/";

function Login() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');


  const removeData = async (name) => {
    try {
      await AsyncStorage.removeItem(name);
      console.log('Data removed successfully.');
    } catch (error) {
      console.error('Error removing data:', error);
    }
  };

  const loginCusomer = () => {
    console.log("Loading ....");
    const postData = {
      email: email,
      password: password
    };

    fetch(baseUrl + "customer/getPerson", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData) // Convert the data to JSON string
    })
      .then(response => response.json())
      .then(responseData => {
        // Handle the response data
        if (responseData.message === "ok") {
          AsyncStorage.setItem("name", responseData.name);
          AsyncStorage.setItem("id", responseData.id);
          AsyncStorage.setItem("email", responseData.email);
          AsyncStorage.setItem("phone", responseData.phone);
          removeData("cartItems");
          console.log("Login successful");
          navigation.navigate("Customer")
        }
        else{
          Alert.alert(responseData.message)
        }

      })
      .catch(error => {
        // Handle any errors
        console.error(error);
      })

  }

  return (
    <ImageBackground source={require('../assets/img4.jpg')} resizeMode="cover" style={{ flex: 1 }}>

      <SafeAreaView style={loginStyles.container}>
        <Text style={loginStyles.lable}>Email</Text>
        <TextInput keyboardType='email-address' style={loginStyles.input} onChangeText={newText => setEmail(newText.toString())}>Yousef@yahoo.co</TextInput>

        <Text style={loginStyles.lable}>Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={loginStyles.input} onChangeText={newText => setPassword(md5(newText.toString()))}></TextInput>
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

export default Login;

