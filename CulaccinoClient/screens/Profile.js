import { Text, ImageBackground, TextInput, StyleSheet, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';


const baseUrl = "http://192.168.100.5:5000/api/";


//Start Profile
function Profile() {
    const [emailShare, setEmailShare] = useState('');
    const [nameShare, setNameShare] = useState('');
    const [phoneShare, setPhoneShare] = useState('');
    const [idShare, setIdShare] = useState('');
    const isFocused = useIsFocused();


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
    }, [isFocused]);
    return (
        <ImageBackground source={require('../assets/img1.jpg')} resizeMode="cover" style={profileStyles.container}>
            <Pressable style={profileStyles.container1}>
                <Text style={profileStyles.Lable}>Name</Text>
                <TextInput keyboardType='default' style={profileStyles.Input} onChangeText={newText => setNameShare(newText)}>{nameShare}</TextInput>

                <Text style={profileStyles.Lable}>Email</Text>
                <TextInput keyboardType='email-address' style={profileStyles.Input} onChangeText={newText => setEmailShare(newText.toString())}>{emailShare}</TextInput>

                <Text style={profileStyles.Lable}>Phone Number</Text>
                <TextInput keyboardType='phone-pad' style={profileStyles.Input} onChangeText={newText => setPhoneShare(newText.toString())}>{phoneShare}</TextInput>
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

});
//End profileStyles

export default Profile;
