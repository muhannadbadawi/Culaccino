import { View, Text, StyleSheet, Image, FlatList, Modal, Button, TouchableOpacity, ImageBackground } from 'react-native';
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
    const createdAtDate = new Date(item.createdAt);
    const formattedDate = `${createdAtDate.getDate()}/${createdAtDate.getMonth() + 1}/${createdAtDate.getFullYear()}`;

    return (
      <SafeAreaView>
        <TouchableOpacity style={previousOrderStyles.orderCard} onPress={() => handleShowItemdModal(item._id)}>
          <View>
            <Text style={previousOrderStyles.orderPrice}>{item.totalPrice} JOD</Text>
            <Text style={previousOrderStyles.orderDate}>{formattedDate}</Text>
          </View>
          <Icon name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </SafeAreaView>
    )
  };
  const renderItems = ({ item, showStars }) => {
    // ... Your existing code ...

    return (
         <SafeAreaView style={previousOrderStyles.itemCard}>
         {/* Display item image and info */}
         <View style={previousOrderStyles.itemInfoContainer}>
           <Text style={previousOrderStyles.itemName}>{itemNames[item.itemId]}</Text>
         </View>
         {/* Display item rating stars */}
         <View style={previousOrderStyles.ratingContainer}>
           {[1, 2, 3, 4, 5].map((numOfStars) => (
             <TouchableOpacity key={numOfStars} onPress={() => showStars(itemId, numOfStars)}>
               <Icon
                 name={userRating >= numOfStars ? "star" : "star-border"}
                 size={24}
                 color="gold"
                 style={previousOrderStyles.starIcon}
               />
             </TouchableOpacity>
           ))}
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
    <View style={previousOrderStyles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
      />
      <Modal animationType="slide" transparent={true} visible={isItemsVisible}>
        <View style={previousOrderStyles.modalContainer}>
          <View style={previousOrderStyles.modalContent}>
            <Text style={previousOrderStyles.modalTitle}>List Of Items in Your Order</Text>
            <FlatList
              data={items}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => renderItems({ item, showStars })} // Ensure showStars is passed here
            />
            <View style={previousOrderStyles.buttonContainer}>
              <TouchableOpacity onPress={submitItemRating} style={previousOrderStyles.submitButton}>
                <Icon name="check" size={24} color="white" />
                <Text style={previousOrderStyles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleHideItemdModal} style={previousOrderStyles.cancelButton}>
                <Icon name="close" size={24} color="white" />
                <Text style={previousOrderStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
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
    flex: 1,
    margin: 10,
  },
  orderCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  orderPrice: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    elevation: 2,
  },
  itemInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginHorizontal: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980B9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});
//End cartStyles

export default PreviousOrder;
