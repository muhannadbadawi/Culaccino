import { View, Text, StyleSheet, FlatList, Modal, Button, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons';


const baseUrl = "http://192.168.1.189:5000/api/";



function PreviousOrder() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [isItemsVisible, setIsItemsVisible] = useState(false);
  const [itemNames, setItemNames] = useState({});
  const [itemRatings, setItemRatings] = useState({});
  const [rateValue, setRateValue] = useState(0);




  const isFocused = useIsFocused();


  useEffect(() => {
    AsyncStorage.getItem('id')
      .then((jsonData) => {
        if (jsonData !== null) {
          setCustomerId(jsonData);
        }
      })
      .catch((error) => console.error('Error retrieving cart data:', error));
    if (customerId) {
      fetch(baseUrl + "order/getOrder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId })
      })
        .then(response => response.json())
        .then(responseData => {
          console.log("database", responseData);
          setOrders(responseData);
        })
        .catch(error => console.error('Error fetching orders:', error));
    }
    const fetchItem = async (itemId) => {
      try {
        const response = await fetch(baseUrl + 'menu/get/' + itemId);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };

    // Fetch the item names for all items in the items array
    // and store them in the itemNames state
    const fetchAllItemNames = async () => {
      const names = {};
      for (const item of items) {
        const itemName = await fetchItem(item.itemId);
        names[item.itemId] = itemName.name;
      }
      setItemNames(names);
    };

    // Check if there are items to fetch names for
    if (items.length > 0) {
      fetchAllItemNames();
    }

  }, [isFocused, customerId, items]);

  const showStars = (itemId, numOfStars) => {
    setItemRatings((prevRatings) => ({
      ...prevRatings,
      [itemId]: numOfStars,
    }));
  };
  const submitItemRating = async () => {

    try {
      // Loop through each element in the items array
      for (const element of items) {
        // Prepare the data to be sent in the request
        const ratingsData = {
          itemId: element.itemId,
          orderId: element.orderId,
          rate: itemRatings[element.itemId]
        };

        // Send a POST request to the server
        const response = await fetch(baseUrl + "order/update", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ratingsData),
        });

        // Check if the response is not successful
        if (!response.ok) {
          // Handle non-successful response (e.g., server error, not found, etc.)
          throw new Error('Failed to submit item rating');
        }
      };

      // All requests completed successfully, hide the modal
      handleHideItemModal();
    } catch (error) {
      // Log the error to the console
      console.error('Error submitting item ratings:', error);
      // Handle the error as needed (e.g., show an error message to the user)
    }

  };

  const renderOrder = ({ item }) => {
    // Parse the createdAt date string into a Date object
    const createdAtDate = new Date(item.createdAt);

    // Get the individual date components (day, month, year, and time)
    const day = createdAtDate.getDate();
    const month = createdAtDate.getMonth() + 1; // Months are zero-based
    const year = createdAtDate.getFullYear();
    const time = createdAtDate.toLocaleTimeString();

    return (
      <SafeAreaView>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => handleShowItemdModal(item._id)}>
          <View style={{ width: "50%" }}>
            <Text style={{ fontSize: 18, color: "green" }}>{item.totalPrice} JOD</Text>
          </View>
          <View style={{ width: "50%" }}>
            {/* Display the formatted date */}
            <Text style={previousOrderStyles.textItem}>
              {day}/{month}/{year} {time}
            </Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    )
  };
  const renderItems = ({ item, showStars }) => {
    const itemId = item.itemId;

    const userRating = itemRatings[itemId] || 0;

    return (
      <SafeAreaView style={{ flexDirection: 'row' }}>
        <View style={{ marginVertical: "10%", width: '60%' }}>
          <Text style={{ fontSize: 20, color: 'green' }}>{itemNames[item.itemId]}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: "10%", width: '40%' }}>
          <Icon name="star" style={{ fontSize: 25, color: userRating >= 1 ? "rgb(255,255,0)" : "white" }} onPress={() => showStars(itemId, 1)} />
          <Icon name="star" style={{ fontSize: 25, color: userRating >= 2 ? "rgb(255,255,0)" : "white" }} onPress={() => showStars(itemId, 2)} />
          <Icon name="star" style={{ fontSize: 25, color: userRating >= 3 ? "rgb(255,255,0)" : "white" }} onPress={() => showStars(itemId, 3)} />
          <Icon name="star" style={{ fontSize: 25, color: userRating >= 4 ? "rgb(255,255,0)" : "white" }} onPress={() => showStars(itemId, 4)} />
          <Icon name="star" style={{ fontSize: 25, color: userRating >= 5 ? "rgb(255,255,0)" : "white" }} onPress={() => showStars(itemId, 5)} />
        </View>
      </SafeAreaView>
    );
  };
  const handleShowItemdModal = (orderId) => {

    fetch(baseUrl + "order/getItemsOrder", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId })
    })
      .then(response => response.json())
      .then(responseData => {
        console.log("set items Done");
        setItems(responseData);
      })
      .catch(error => console.error('Error fetching orders:', error));

    setIsItemsVisible(true);

  };
  const handleHideItemdModal = () => {
    setIsItemsVisible(false);
  };
  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
      />
      <Modal animationType="slide" transparent={true} visible={isItemsVisible}>
        <View style={previousOrderStyles.modalContainer}>
          <View style={previousOrderStyles.modalInfoContent}>
            <Text style={previousOrderStyles.modalTitle}>List Of Items in your order</Text>
            <FlatList
              data={items}
              keyExtractor={(items) => items._id}
              renderItem={({ item }) => renderItems({ item, showStars })}
            />
            <View style={previousOrderStyles.buttonContainer}>
              <Button title="Submit" onPress={submitItemRating} color="#2980B9" />
            </View>
            <View style={previousOrderStyles.buttonContainer}>
              <Button title="Cancel" onPress={handleHideItemdModal} color="#E74C3C" />
            </View>
          </View>
        </View>
      </Modal>
    </View>

  );
}
//Start cartStyles
const previousOrderStyles = StyleSheet.create({
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
    fontSize: 18
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInfoContent: {
    backgroundColor: '#ddd',
    padding: "5%",
    borderRadius: 20,
    width: '90%',
    height: "90%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: "10%",
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: "2%",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: "7%",
  },
});
//End cartStyles

export default PreviousOrder;
