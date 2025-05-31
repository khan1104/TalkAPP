import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config'; // Adjust according to your project structure

const Changepass = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mail } = route.params;
  const [password, setPassword] = useState('');
  const [cpass, setCpass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{7,}$/;

  const next = async () => {
    if (!password || !cpass) {
      Alert.alert("Input Error", "Both fields are required.");
      return;
    }

    if (password !== cpass) {
      Alert.alert("Invalid Password", "Password and confirm password should be the same.");
    } else {
      const userRef = doc(db, 'users', mail); // Use the user's email as the document ID
      setLoading(true); // Start loading

      try {
        await updateDoc(userRef, {
          password: password // Update the password field
        });
        Alert.alert("Success", "Password has been changed successfully.");
        navigation.navigate("auth/login"); // Navigate to the login screen or any other screen
      } catch (error) {
        console.error("Error updating password:", error);
        Alert.alert("Error", "Failed to change password. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    }
  };

  const validatePassword = (password) => {
    return regex.test(password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="security" size={150} color="black" />
        <Text style={styles.title}>Reset Your Password</Text>
      </View>

      <View style={[styles.inputContainer, !validatePassword(password) && password.length > 0 && styles.inputError]}>
        <FontAwesome name="lock" size={34} color="black" style={styles.icon} />
        <TextInput
          placeholder='Enter New Password'
          style={styles.textInput}
          autoCapitalize='none'
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          maxLength={15}
        />
      </View>
      {!validatePassword(password) && password.length > 0 && (
        <View style={styles.errorContainer}>
          <FontAwesome5 name="exclamation-circle" size={15} color="red" />
          <Text style={styles.errorText}>Password must be at least 7 characters long and include both uppercase and lowercase letters</Text>
        </View>
      )}
      <View style={styles.inputContainer}>
        <MaterialIcons name="confirmation-number" size={28} color="black" style={styles.icon} />
        <TextInput
          placeholder='Confirm Password'
          style={styles.textInput}
          autoCapitalize='none'
          secureTextEntry={!showPassword}
          onChangeText={setCpass}
          maxLength={15}
        />
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.checkbox}>
          <View style={[styles.checkboxBox, showPassword && styles.checkboxChecked]}>
            {showPassword && <Text style={styles.checkboxCheckmark}>✔</Text>}
          </View>
          <Text style={styles.checkboxText}>Show Passwords</Text>
        </TouchableOpacity>
      </View>

      <Pressable style={styles.loginbtn} onPress={next} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.loginText}>Change</Text>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7fa",
    padding: 15,
  },
  header: {
    alignItems: "center",
    marginTop: 30,
    flexDirection: "column",
    gap: 15,
  },
  title: {
    fontSize: 30,
  },
  inputContainer: {
    borderColor: "black",
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    height: 50,
    marginTop: 25,
  },
  inputError: {
    borderColor: 'red',
  },
  textInput: {
    width: 270,
    fontSize: 16,
  },
  icon: {
    marginHorizontal: 15,
  },
  errorContainer: {
    flexDirection: "row",
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 13,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkboxCheckmark: {
    color: 'white',
    fontSize: 16,
  },
  checkboxText: {
    fontSize: 20,
  },
  loginbtn: {
    borderColor: "black",
    borderWidth: 2,
    height: 50,
    width: 230,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#262424",
    marginHorizontal: 55,
    marginTop: 20,
  },
  loginText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
});

export default Changepass;