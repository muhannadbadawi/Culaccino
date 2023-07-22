import { Text, ImageBackground, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import md5 from 'md5';

const baseUrl = "http://192.168.100.5:5000/api/";
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
        if (!name || !phone || !email || !password || !confirmPassword) {
            console.log("All fields are required.");
            Alert.alert("All fields are required.")
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            console.log("Invalid email format.");
            Alert.alert("Invalid email format.")
            return;
        }

        if (phone && !/^\d{10}$/.test(phone)) {
            console.log("Invalid phone number format. It should be 10 digits.");
            Alert.alert("Invalid phone number format. It should be 10 digits.")
            return;
        }


        if (password !== confirmPassword) {
            console.log("Passwords do not match.");
            Alert.alert("Passwords do not match.")
            return;
        }

        const postData = {
            name: name,
            phone: phone,
            email: email,
            password: password
        };

        fetch(baseUrl + "customer", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(responseData => {
            console.log("Registration successful.");
            navigation.navigate("Login");
        })
        .catch(error => {
            console.error("Registration error:", error);
        });
    };
    return (
        <ImageBackground source={require('../assets/img1.jpg')} resizeMode="cover" style={registerStyles.container}>
            <Pressable style={registerStyles.container1}>
                <Text style={registerStyles.Lable}>Name</Text>
                <TextInput keyboardType='default' style={registerStyles.Input} onChangeText={newText => setName(newText)}></TextInput>

                <Text style={registerStyles.Lable}>Email</Text>
                <TextInput keyboardType='email-address' style={registerStyles.Input} onChangeText={newText => setEmail(newText.toString())}></TextInput>

                <Text style={registerStyles.Lable}>Phone Number</Text>
                <TextInput keyboardType='phone-pad' style={registerStyles.Input} onChangeText={newText => setPhone(newText.toString())}></TextInput>

                <Text style={registerStyles.Lable}>Password</Text>
                <TextInput secureTextEntry={true} keyboardType='visible-password' style={registerStyles.Input} onChangeText={newText => setPassword(md5(newText.toString()))}></TextInput>

                <Text style={registerStyles.Lable}>Confirm Password</Text>
                <TextInput secureTextEntry={true} keyboardType='visible-password' style={registerStyles.Input} onChangeText={newText => setConfirmPassword(md5(newText.toString()))}></TextInput>

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


export default Register;
