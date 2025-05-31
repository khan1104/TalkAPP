import React, { useState } from 'react';
import { View, Text, Dimensions, Image, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDocs, collection } from 'firebase/firestore';
import { app, db } from "../config";

const { width } = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (mail.length === 0 || password.length < 7) {
      Alert.alert("Please enter valid email and password");
    } else {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        let found = false;

        querySnapshot.forEach((doc) => {
          const user = doc.data();
          if (user.mail === mail && user.password === password) {
            found = true;
            AsyncStorage.setItem('isLoggedIn', 'true');
            AsyncStorage.setItem('userEmail', mail);
            router.replace("/chats");
          }
        });

        if (!found) {
          Alert.alert("Invalid Email or Password");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#e6f7fa" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/images/loginicon.png')} style={styles.image} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputContainer}>
              <Entypo name="email" size={30} color="black" style={styles.icon} />
              <TextInput
                placeholder="Enter your email"
                style={styles.textInput}
                value={mail}
                onChangeText={setMail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                accessible
                accessibilityLabel="Email input"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={30} color="black" style={styles.icon} />
              <TextInput
                placeholder="Enter your password"
                style={styles.textInput}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                accessible
                accessibilityLabel="Password input"
              />
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="black"
                style={styles.eyeIcon}
                onPress={toggleShowPassword}
              />
            </View>

            <Pressable onPress={() => navigation.navigate("auth/forgotpass")}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </Pressable>

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable style={styles.signupButton} onPress={() => navigation.navigate('auth/singup')}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7fa",
  },
  imageContainer: {
    alignItems: "center",
    marginTop:20,
  },
  image: {
    width: 240,
    height: 240,
  },
  formContainer: {
    padding: 25,
    marginTop:10,
    backgroundColor: "#f2f7f7",
    borderRadius: 20,
    margin: 10,
    shadowColor: "black",
    elevation: 5,
  },
  title: {
    fontSize:40,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
    marginBottom:20
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    height: 50,
    marginBottom: 15,
  },
  icon: {
    marginHorizontal: 15,
  },
  textInput: {
    width: 200,
    fontSize: 16,
    paddingLeft: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  forgotPassword: {
    color: "blue",
    textAlign: "right",
    marginBottom:10,
  },
  loginButton: {
    backgroundColor: "#262424",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  signupButton: {
    backgroundColor: "#262424",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  signupButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
});

export default Login;
