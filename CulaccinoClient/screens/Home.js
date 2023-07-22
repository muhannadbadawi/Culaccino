import { View, TouchableOpacity, Alert, Text, Pressable, FlatList, ImageBackground, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useIsFocused, useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const baseUrl = "http://192.168.100.5:5000/api/";

//Start Home
function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  // const [quantity, setQuantity] = useState(0);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    fetch(baseUrl + 'menu/getAll')
      .then((response) => response.json())
      .then((json) => {
        const menuItemsWithQuantities = json.map(item => {
          const cartItem = cartItems.find((cartItem) => cartItem.id === item._id);
          return { ...item, quantity: cartItem ? cartItem.quantity : 0 };
        });
        setMenuItems(menuItemsWithQuantities);
        console.log(menuItems);
      })
      .catch((error) => alert(error));

    // Fetch cart items from AsyncStorage when the component mounts
    AsyncStorage.getItem('cartItems')
      .then((jsonData) => {
        if (jsonData !== null) {
          setCartItems(JSON.parse(jsonData));
        }
      })
      .catch((error) => console.error('Error retrieving cart data:', error));
  }, [isFocused]);

  const handleAddToCart = async (itemToAdd) => {
    try {
      const jsonData = await AsyncStorage.getItem('cartItems');
      let cartItems = [];

      if (jsonData !== null) {
        cartItems = JSON.parse(jsonData);
        const existingItemIndex = cartItems.findIndex((item) => item.id === itemToAdd.id);

        if (existingItemIndex !== -1) {
          // Item already exists in the cart, increase the quantity
          cartItems[existingItemIndex].quantity += 1;
        } else {
          // Item does not exist in the cart, add it with quantity 1
          itemToAdd.quantity = 1; // Set the quantity to 1 for a new item
          cartItems.push(itemToAdd);
        }
      } else {
        // If cartItems is not found in AsyncStorage, create a new array with the itemToAdd
        itemToAdd.quantity = 1; // Set the quantity to 1 for the first item in the cart
        cartItems.push(itemToAdd);
      }

      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
      setCartItems(cartItems); // Update the state with the updated cart items

      // Update menuItems state with the new quantities
      const updatedMenuItems = menuItems.map((item) => {
        const cartItem = cartItems.find((cartItem) => cartItem.id === item._id);
        return { ...item, quantity: cartItem ? cartItem.quantity : 0 };
      });
      setMenuItems(updatedMenuItems);
    } catch (error) {
      console.error('Error retrieving/updating cart data:', error);
    }
  };

  const filteredData = menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));


  
  //list items body 
  const renderItem = ({ item }) => {
    // Check if the item exists in AsyncStorage cart
      const cartItem = cartItems.find((cartItem) => cartItem.id === item._id);
      const quantity=(cartItem ? cartItem.quantity : 0);

    return (
      <TouchableOpacity style={homeStyles.itemContainer}>
        <View style={{ width: '10%' }}>
          <Text style={homeStyles.textItem}>
            ({quantity})
          </Text>
        </View>
        <View style={{ width: '50%' }}>
          <Text style={homeStyles.textItem}>
            {item.name}
          </Text>
        </View>
        <View style={{ width: '30%' }}>
          <Text style={homeStyles.textItem}>
            {item.price} JOD
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={{ flexDirection: 'row' }}
            onPress={() => handleAddToCart({
              id: item._id,
              name: item.name,
              price: item.price,
            })}
          >
            <Icon name="add-circle" style={homeStyles.quantityButton} color="tomato" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  //Stert return HomeScreen
  return (
    <ImageBackground source={require('../assets/img5.jpg')} resizeMode="cover" style={{ flex: 1 }}>
      <SafeAreaView>
        {/* Text Input for search */}
        <View style={{ flexDirection: 'row', height: "8%" }}>
          <TextInput
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Search by name"
            style={homeStyles.searchItemInput}
          />
        </View>

        <View style={homeStyles.container}>
          <View style={homeStyles.menuContainer}>
            {/*display the Header */}
            <View style={homeStyles.headerContainer}>
              <Text style={homeStyles.headerText}>Name</Text>
              <Text style={homeStyles.headerText}>Price</Text>
            </View>
            <View style={homeStyles.separator} />
            {/* display the items  */}
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
  //End return HomeScreen
}
//End Home

//Start homeStyles
const homeStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: "#dff",
    marginTop: 0,
    marginHorizontal: "5%",
    borderRadius: 10,
    opacity: 0.8,
    height: "92%",
  },
  menuContainer: {
    flex: 1,
    marginHorizontal: 5,
    width: "100%",
    height: "100%",
  },
  quantityButton: {
    fontSize: 30,
    width: "50%",
  },
  textItem: {
    marginBottom: '15%',
    fontWeight: '400',
    fontSize: 18
  },
  searchItemInput: {
    justifyContent: 'center',
    marginHorizontal: "5%",
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    padding: "4%",
    fontSize: 18,
    borderRadius: 10
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    marginHorizontal: '14%',
    marginVertical: '5%',
    textAlign: 'left',
  },
  separator: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    marginBottom: '5%',
  },
  itemContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    justifyContent: 'center', // Center items horizontally
    width: "25%",
    height: "40%",
    backgroundColor: "#fff",
    padding: "1%",
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: "400"
  },
});
//End homeStyles
export default Home;