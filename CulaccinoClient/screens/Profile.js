import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Pressable, Button, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import md5 from 'md5';

const baseUrl = "http://192.168.1.189:5000/api/";

const Profile = () => {
    const [idShare, setIdShare] = useState('');
    const [emailShare, setEmailShare] = useState('');
    const [nameShare, setNameShare] = useState('');
    const [phoneShare, setPhoneShare] = useState('');
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const id = await AsyncStorage.getItem('id');
                const name = await AsyncStorage.getItem('name');
                const phone = await AsyncStorage.getItem('phone');
                const email = await AsyncStorage.getItem('email');
                setIdShare(id);
                setNameShare(name);
                setPhoneShare(phone);
                setEmailShare(email);
            } catch (error) {
                console.error('Error retrieving item:', error);
            }
        };

        loadUserProfile();
    }, [isFocused]);

    const handleShowPasswordModal = () => {
        setPasswordModalVisible(true);
    };

    const handleHidePasswordModal = () => {
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("");
        setPasswordModalVisible(false);
    };
    const handleShowInfoModal = () => {
        setInfoModalVisible(true);
    };
    const handleHideInfoModal = () => {
        setOldPassword("")
        setInfoModalVisible(false);
    };
    const handleInfoChange = () => {
        const postData = {
            "name": nameShare,
            "email": emailShare,
            "phone": phoneShare,
            password: md5(oldPassword),
        };
        fetch(baseUrl + "customer/update/" + idShare, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData) // Convert the data to JSON string
        })
            .then(response => response.json())
            .then(responseData => {
                // Handle the response data
                if (responseData.message === "changed successfully!") {
                    alert(responseData.message);
                    handleHideInfoModal();
                    navigation.navigate('Profile');
                }
                else {
                    alert(responseData.message);
                }
            })
    };
    const handlePasswordChange = () => {
        if (newPassword === confirmPassword) {
            const postData = {
                oldPassword: md5(oldPassword),
                newPassword: md5(newPassword)
            };
            fetch(baseUrl + "customer/updatePassword/" + idShare, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData) // Convert the data to JSON string
            })
                .then(response => response.json())
                .then(responseData => {
                    // Handle the response data
                    if (responseData.message === "Password changed successfully!") {
                        console.log(responseData.message)
                        alert('Password changed successfully!');
                        handleHidePasswordModal();
                    }
                    else if (responseData.message === "The old password is wrong") {
                        alert('The old password is wrong.');
                    }
                    else if (responseData.message === "person not found") {
                        alert('person not found .Please try again.');
                    }
                    else {
                        alert("Something went wrong");
                    }
                })
        } else {
            alert('Passwords do not match. Please try again.');
        }
    };

    return (
        <ImageBackground source={require('../assets/img1.jpg')} resizeMode="cover" style={profileStyles.container}>
            <View style={profileStyles.container1}>
                <Text style={profileStyles.title}>User Profile</Text>
                <Text style={profileStyles.label}>Name</Text>
                <TextInput style={profileStyles.infoText} onChangeText={(text) => { setNameShare(text) }}>{nameShare}</TextInput>
                <Text style={profileStyles.label}>Email</Text>
                <TextInput style={profileStyles.infoText} onChangeText={(text) => { setEmailShare(text) }}>{emailShare}</TextInput>
                <Text style={profileStyles.label}>Phone</Text>
                <TextInput style={profileStyles.infoText} onChangeText={(text) => { setPhoneShare(text) }}>{phoneShare}</TextInput>
                <Pressable style={profileStyles.changePasswordButton} onPress={handleShowInfoModal}>
                    <Text style={profileStyles.changePasswordButtonText}>Change Information</Text>
                </Pressable>
                <Pressable style={profileStyles.changePasswordButton} onPress={handleShowPasswordModal}>
                    <Text style={profileStyles.changePasswordButtonText}>Change Password</Text>
                </Pressable>


                <Modal animationType="slide" transparent={true} visible={isInfoModalVisible}>
                    <View style={profileStyles.modalContainer}>
                        <View style={profileStyles.modalInfoContent}>
                            <Text style={profileStyles.modalTitle}>Change Personal information</Text>
                            <Text style={profileStyles.label}>Enter password</Text>
                            <TextInput
                                style={profileStyles.input}
                                keyboardType="default"
                                secureTextEntry={true}
                                onChangeText={setOldPassword}
                                value={oldPassword}
                            />
                            <View style={profileStyles.buttonContainer}>
                                <Button title="Submit" onPress={handleInfoChange} color="#2980B9" />
                                <Button title="Cancel" onPress={handleHideInfoModal} color="#E74C3C" />
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal animationType="slide" transparent={true} visible={isPasswordModalVisible}>
                    <View style={profileStyles.modalContainer}>
                        <View style={profileStyles.modalPassContent}>
                            <Text style={profileStyles.modalTitle}>Change Password</Text>
                            <Text style={profileStyles.label}>Enter old password</Text>
                            <TextInput
                                style={profileStyles.input}
                                keyboardType="default"
                                secureTextEntry={true}
                                onChangeText={setOldPassword}
                                value={oldPassword}
                            />
                            <Text style={profileStyles.label}>Enter new password</Text>
                            <TextInput
                                style={profileStyles.input}
                                keyboardType="default"
                                secureTextEntry={true}
                                onChangeText={setNewPassword}
                                value={newPassword}
                            />
                            <Text style={profileStyles.label}>Confirm new password</Text>
                            <TextInput
                                style={profileStyles.input}
                                keyboardType="default"
                                secureTextEntry={true}
                                placeholder='sa'
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                            />
                            <View style={profileStyles.buttonContainer}>
                                <Button title="Submit" onPress={handlePasswordChange} color="#2980B9" />
                                <Button title="Cancel" onPress={handleHidePasswordModal} color="#E74C3C" />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};
const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container1: {
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: "5%",
        height: "70%",
        width: "90%"

    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: "20%",
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: "2%",
    },
    input: {
        backgroundColor: '#f2f2f2',
        width: '100%',
        height: "12%",
        borderRadius: 10,
        paddingHorizontal: "5%",
        fontSize: 18,
        color: '#333',
        marginBottom: "5%",

    },
    changePasswordButton: {
        backgroundColor: '#3498DB',
        paddingVertical: "5%",
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: "5%",
    },
    changePasswordButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalPassContent: {
        backgroundColor: '#ddd',
        padding: "5%",
        borderRadius: 20,
        width: '80%',
        height: "50%",
    },
    modalInfoContent: {
        backgroundColor: '#ddd',
        padding: "5%",
        borderRadius: 20,
        width: '80%',
        height: "30%",
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: "10%",
        textAlign: 'center',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: "7%",
    },
    infoText: {
        fontSize: 24,
        marginBottom: "10%",
        fontStyle: 'italic',
    }
});

export default Profile;
