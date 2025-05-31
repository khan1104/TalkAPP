import {
    View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Alert, ActivityIndicator, Modal, KeyboardAvoidingView,
    Platform
} from 'react-native';
import React, { useState } from 'react';
import OtpTextInput from "react-native-otp-textinput";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getDocs, collection } from 'firebase/firestore';
import { app, db } from "../config";
import { useNavigation } from 'expo-router';
import axios from 'axios';
import { IP } from '../config';

const Forgotpass = () => {
    const navigation = useNavigation();
    const [mail, setMail] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [otp, setOtp] = useState("");
    const [backendOtp, setBackendOtp] = useState("");
    const [showError, setShowError] = useState(false);

    const validateEmail = (email) => emailRegex.test(email);

    const handleNext = async () => {
        if (!validateEmail(mail)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userFound = querySnapshot.docs.some(doc => doc.data().mail === mail);

            if (!userFound) {
                Alert.alert("Email Not Found", "The entered email does not exist.");
                return;
            }
            setModalVisible(true);
            await sendDataToBackend();
        } catch (error) {
            console.error("Error fetching users:", error);
            Alert.alert("Error", "There was a problem, please try again.");
        } finally {
            setLoading(false);
        }
    };

    const sendDataToBackend = async () => {
        try {
            const response = await axios.post(`http://${IP}:5000/send-otp`, { mail });
            console.log('Response from backend:', response.data);
            setBackendOtp(response.data.message);
        } catch (error) {
            console.error('Error sending data:', error);
            Alert.alert("Server Error", "Unable to send OTP at this moment.");
        }
    };
    const verifyOtp = () => {
        if (otp === backendOtp) {
            setShowError(false);
            navigation.navigate("auth/changepass", { mail:mail });
        } else {
            setShowError(true);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <FontAwesome name="question-circle-o" size={150} color="black" />
                <Text style={styles.headerText}>It's Okay! Reset your Password</Text>
            </View>
            <View style={styles.inputContainer}>
                <Entypo name="email" size={30} color="black" style={styles.icon} />
                <TextInput 
                    placeholder='Enter your email'
                    style={styles.textInput}
                    value={mail}
                    onChangeText={setMail}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </View>
            {!validateEmail(mail) && mail.length > 0 && (
                <View style={styles.errorContainer}>
                    <FontAwesome5 name="exclamation-circle" size={15} color="red" />
                    <Text style={styles.errorText}>Please enter a valid email ID.</Text>
                </View>
            )}
            <View style={styles.buttonContainer}>
                <Pressable style={styles.loginButton} onPress={handleNext}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#ffffff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Next</Text>
                    )}
                </Pressable>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Enter the OTP to Verify Your Email</Text>
                        <OtpTextInput
                            inputCount={6}
                            handleTextChange={setOtp}
                            textInputStyle={styles.otpBox}
                            tintColor={"blue"}
                            offTintColor={"black"}
                            containerStyle={styles.otpContainer}
                        />
                        {showError && <Text style={styles.errorText}>You entered the wrong OTP.</Text>}
                        <Pressable 
                            style={[styles.verifyButton, { backgroundColor: otp.length === 6 ? "black" : "gray" }]}
                            onPress={verifyOtp}
                            disabled={otp.length !== 6}
                        >
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#e6f7fa',
        padding: 10,
    },
    header: {
        alignItems: "center",
        marginTop: 30,
        flexDirection: "column",
        gap: 15,
    },
    headerText: {
        fontSize: 23,
        fontWeight: "400",
    },
    inputContainer: {
        borderColor: "black",
        borderWidth: 2,
        flexDirection: "row",
        borderRadius: 10,
        height: 50,
        marginTop: 30,
    },
    icon: {
        marginHorizontal: 15,
        marginTop: 7,
    },
    textInput: {
        width: 270,
        fontSize: 16,
    },
    errorContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 10,
    },
    errorText: {
        color: "red",
        fontSize: 13,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 30,
    },
    loginButton: {
        backgroundColor: "#262424",
        height: 45,
        width: 200,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    loginButtonText: {
        fontSize: 23,
        color: "white",
        letterSpacing: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        marginTop: 290,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        width: 340,
        height: 400,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    otpBox: {
        height: 49,
        width: 45,
        borderBottomWidth: 2,
        borderWidth: 2,
        borderRadius: 8,
        textAlign: "center",
    },
    otpContainer: {
        padding: 12,
        marginTop:20,
    },
    verifyButton: {
        height: 50,
        width: 230,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#262424",
        marginHorizontal: 60,
        marginTop: 30,
    },
    verifyButtonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
});
export default Forgotpass;