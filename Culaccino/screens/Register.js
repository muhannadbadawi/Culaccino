import { View, Text, Button, ImageBackground, TextInput, StyleSheet, Pressable, Image } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import axios from 'axios';
import React, { useState } from 'react'
const baseUrl = "http://192.168.100.5:5000/api/people";



const Register = () => {
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
          console.log({ name });
          console.log(responseData);
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
    <ImageBackground source={require('./../assets/img1.jpg')} resizeMode="cover" style={styles.container}>
      <Pressable style={styles.container1}>
        <Text style={styles.Lable}>Name</Text>
        <TextInput keyboardType='default' style={styles.Input} onChangeText={newText => setName(newText)}></TextInput>

        <Text style={styles.Lable}>Email</Text>
        <TextInput keyboardType='email-address' style={styles.Input} onChangeText={newText => setEmail(newText.toString())}></TextInput>

        <Text style={styles.Lable}>Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={styles.Input} onChangeText={newText => setPassword(newText.toString())}></TextInput>

        <Text style={styles.Lable}>Confirm Password</Text>
        <TextInput secureTextEntry={true} keyboardType='visible-password' style={styles.Input} onChangeText={newText => setConfirmPassword(newText.toString())}></TextInput>



        <Pressable style={styles.Button} onPress={registerCusomer}>

          <Text style={styles.text}>Register</Text>

        </Pressable>
        <Pressable style={styles.Button} onPress={() => navigation.navigate("Login")} >

          <Text style={styles.text}>I Have an account</Text>

        </Pressable>
      </Pressable>

    </ImageBackground>
  )
}
const styles = StyleSheet.create({



  container: {
    flex: 1,
  },
  container1: {
    top: 135,
    left: 5,
    width: '95%',
    height: '70%',
    borderRadius: 50,
    backgroundColor: "#555",
    padding: 30,
    opacity: 0.9,
  },
  Lable: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 15,
    marginLeft: 15,
  },
  Input: {
    backgroundColor: '#fff',
    width: 320,
    height: 50,
    borderRadius: 20,
    padding: 10,
    fontSize: 20,
    marginBottom: 15,
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

export default Register