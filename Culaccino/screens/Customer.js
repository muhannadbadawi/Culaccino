import { View, Text, Button, Dimensions, ImageBackground, TextInput, StyleSheet, Pressable, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from "@react-navigation/native"

async function removeItemFromStorage(itemName) {
    try {
        await AsyncStorage.removeItem(itemName);
        console.log(`Successfully removed ${itemName} from AsyncStorage.`);
    } catch (error) {
        console.error(`Error removing ${itemName} from AsyncStorage:`, error);
    }
}
// async function getItemFromStorage(itemName) {
//     try {
//         const itemValue = await AsyncStorage.getItem(itemName);
//         if (itemValue !== null) {
//             console.log(`Value of ${itemName} in AsyncStorage: ${itemValue}`);
//             return itemValue;
//         } else {
//             console.log(`No value found for ${itemName} in AsyncStorage.`);
//             return null
//         }
//     } catch (error) {
//         console.error(`Error retrieving ${itemName} from AsyncStorage:`, error);
//         return null
//     }
// }


const Customer = ({route}) => {
    const navigation = useNavigation();
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const myurl = "http://192.168.100.5:5000/api/people/g"

    async function getItemFromStorage(itemName) {
        try {
          const itemValue = await AsyncStorage.getItem(itemName);
          if (itemValue !== null) {
            setName(itemValue);
            console.log(`Value of ${itemName} in AsyncStorage: ${itemValue}`);
          } else {
            console.log(`No value found for ${itemName} in AsyncStorage.`);
          }
        } catch (error) {
          console.error(`Error retrieving ${itemName} from AsyncStorage:`, error);
        }
      }

    useEffect(() => {
        fetch(myurl)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.log(error))
            .finally(()=>getItemFromStorage("name"))
    }, [])
    const logoutCusomer = () => {
        removeItemFromStorage("name")
        navigation.navigate("Login")
    }
    //START
    return (
        <SafeAreaView>
            <ScrollView style={[styles.scrollview]}>
                <Text style={{ fontSize: 30, fontWeight: "bold", color: "#fff" }}>{route.params.paramKey}</Text>
                <Pressable style={styles.logoutButton} onPress={logoutCusomer}>

                    <Text style={styles.text}>Logout</Text>

                </Pressable>
            </ScrollView>
            <Button title='Logout' onPress={logoutCusomer}></Button>
            <ImageBackground
                style={[styles.fixed, styles.containter, { zIndex: -1 }]}
                source={require('./../assets/img2.jpg')}
            />
        </SafeAreaView>
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
    }
})
export default Customer