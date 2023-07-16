import { View, Text, Button, Dimensions, ImageBackground, TextInput, StyleSheet, Pressable, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from "@react-navigation/native"

const Customer = () => {
    const navigation = useNavigation();

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [value, setValue] = useState('');

    const logoutCusomer = () => {
        AsyncStorage.clear()
        navigation.navigate("Login")
    }

    const myurl = "http://192.168.100.5:5000/api/people/g"
    useEffect(() => {
        fetch(myurl)
            .then((response) => response.json())
            .then((json) => setData(json))
            .then(() => console.log(data))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false))
    }, [])

    AsyncStorage.getItem("name").then((value) => {
        setValue(value);
    })
    return (
        <View>
            <ScrollView style={[styles.scrollview]}>

                <Text>saas</Text>
                <Text>saas</Text>
                <Text style={{ fontSize: 30, fontWeight: "bold", color: "#fff" }}>{value}</Text>
                <Pressable style={styles.logoutButton} onPress={logoutCusomer}>

                    <Text style={styles.text}>Logout</Text>

                </Pressable>
            </ScrollView>
            <Button title='Logout' onPress={logoutCusomer}></Button>
            <ImageBackground
                style={[styles.fixed, styles.containter, { zIndex: -1 }]}
                source={require('./../assets/img2.jpg')}
            />
        </View>
    )
}
const styles = StyleSheet.create({
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
    },

    // container: {
    //     flex: 1,
    //     justifyContent: 'center',

    // },
    // container1: {

    //     width: '100%',
    //     height: '100%',
    //     borderRadius: 50,
    //     backgroundColor: "#555",
    //     padding: 30,
    //     opacity: 0.9,
    // },
})
export default Customer