import { View, TouchableOpacity, Text, FlatList, ImageBackground, StyleSheet, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

//Start Cart

const baseUrl = "http://192.168.100.5:5000/api/";

// Helper function to retrieve data from AsyncStorage
const getDataFromAsyncStorage = async () => {
  try {
    const jsonData = await AsyncStorage.getItem('cartItems');
    console.log('jsonData:', jsonData);
    if (jsonData !== null) {
      const parsedData = JSON.parse(jsonData).map((item) => {
        return { ...item, quantity: item.quantity || 1 };
      });
      console.log('parsedData:', parsedData);
      return parsedData;
    }
    return [];
  } catch (error) {
    console.error('Error reading data from AsyncStorage:', error);
    return [];
  }
};

// Helper function to save cart data to AsyncStorage
const saveDataToAsyncStorage = async (cartData) => {
  try {
    await AsyncStorage.setItem('cartItems', JSON.stringify(cartData));
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

// Function to render each item in the cart
const renderItem = ({ item, handleDecrement, handleIncrement }) => {
  const price = item.price * item.quantity;
  return (
    <SafeAreaView style={{ flexDirection: 'row' }}>
      <View style={{ width: "55%" }}>
        <Text style={cartStyles.textItem}>{item.quantity} {item.name}</Text>
      </View>
      <View style={{ width: "25%" }}>
        <Text style={cartStyles.textItem}>{price} JD</Text>
      </View>
      <TouchableOpacity onPress={() => handleDecrement(item.id)} style={{ marginLeft: "2%", fontWeight: "500", fontSize: 20 }}>
        <Icon name="remove-circle" style={cartStyles.quantityButton} color="tomato" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleIncrement(item.id)} style={{ marginLeft: "2%", fontWeight: "500", fontSize: 20 }}>
        <Icon name="add-circle" style={cartStyles.quantityButton} color="tomato" />
      </TouchableOpacity>
    </SafeAreaView>
  )
};
function Cart() {
    const [data, setData] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    AsyncStorage.getItem('id')
      .then((itemValue) => {
        setCustomerId(itemValue);
      })
      .catch((error) => {
        console.error('Error retrieving item:', error);
      });

    getDataFromAsyncStorage().then((parsedData) => {
      setData(parsedData);
    });
  }, [isFocused]);

  const handleIncrement = (itemId) => {
    const existingItems = data.findIndex((item) => item.id === itemId);

    if (existingItems !== -1) {
      // Item already exists in the cart, increment its quantity
      const updatedData = [...data];
      updatedData[existingItems].quantity += 1;
      setData(updatedData);
      saveDataToAsyncStorage(updatedData); // Save the updated data to AsyncStorage
    } else {
      // Item does not exist in the cart, add it with quantity 1
      const itemToAdd = data.find((item) => item.id === itemId);

      if (itemToAdd) {
        const updatedData = [...data, { ...itemToAdd, quantity: 1 }];
        setData(updatedData);
        saveDataToAsyncStorage(updatedData); // Save the updated data to AsyncStorage
      }
    }
  };

  // Function to handle decrementing the quantity of an item in the cart
  const handleDecrement = (itemId) => {
    const existingItems = data.findIndex((item) => item.id === itemId);

    if (existingItems !== -1) {
      const updatedData = [...data];
      const newQuantity = updatedData[existingItems].quantity - 1;

      if (newQuantity === 0) {
        // If the quantity becomes zero, remove the item from the cart
        updatedData.splice(existingItems, 1);
      } else {
        updatedData[existingItems].quantity = newQuantity;
      }

      setData(updatedData);
      saveDataToAsyncStorage(updatedData); // Save the updated data to AsyncStorage
    }
  };

  const totalPrice = data.reduce((total, item) => total + item.price * item.quantity, 0);

  const checkout = async () => {
    const items = JSON.parse(await AsyncStorage.getItem('cartItems'));

    fetch(baseUrl + "order", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers required by your API
      },
      body: JSON.stringify({ customerId, items }) // Convert the data to JSON string
    })
  }

  return (
    <ImageBackground source={require('../assets/img5.jpg')} resizeMode="cover" style={{ flex: 1 }}>
      <SafeAreaView style={{ height: '94%' }}>
        <View style={{ width: "90%", height: "8%", flexDirection: 'row', backgroundColor: "#dff", marginHorizontal: "5%", opacity: 0.7, borderRadius: 10 }}>
          <Text style={{ fontWeight: "bold", color: "#000", fontSize: 25, marginHorizontal: "14%", marginVertical: "2%", textAlign: "left" }}><Icon name="shopping-cart" size={30} color="tomato" /> Cart List</Text>
        </View>
        <View style={cartStyles.container}>
          <View style={cartStyles.menuContainer}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: "50%" }}>
                <Text style={cartStyles.textHeader}>Name</Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={cartStyles.textHeader}>Price</Text>
              </View>
            </View>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 2 }} />

            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderItem({ item, handleDecrement, handleIncrement })}
            />
            <Pressable style={cartStyles.buttonContainer} onPress={checkout}>
              <View>
                <Text style={cartStyles.buttonText}>
                  checkout
                </Text>
              </View>
              <View>
                <Text>
                  {totalPrice} JD
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );

    //End return CartScreen
}
//End Cart

//Start cartStyles
const cartStyles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Arrange items horizontally
        justifyContent: 'center', // Center items horizontally
        height: "100%",
        marginTop: 20,
        margin: "3%",
        backgroundColor: "#dff",
        borderRadius: 10,
        opacity: 0.8,
    },
    menuContainer: {
        flex: 1, // Each button container should take equal space
        marginHorizontal: 5,
        width: "100%",
        height: "100%",
    },
    quantityButton: {
        fontSize: 28,
        position: "relative",
        right: 0,
    },
    textItem: {
        marginLeft: "3%",
        fontWeight: "400",
        fontSize: 20
    },
    buttonContainer: {
        justifyContent: 'center', // Center items horizontally
        width: "40%",
        height: "10%",
        marginVertical: "3%",
        backgroundColor: "#fff",
        padding: "1%",
        borderRadius: 10,
        marginHorizontal: "5%",

    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 22,
        fontWeight: "400",
    },
    textHeader: {
        fontWeight: "bold",
        fontSize: 17,
        marginHorizontal: "14%",
        marginVertical: "5%",
        textAlign: "left"
    }
});
//End cartStyles

export default Cart;
