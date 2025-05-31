import React, { useRef, useState, useContext } from 'react';
import { View, Text, Dimensions, Image, TextInput, Pressable, StyleSheet, ScrollView, Alert, ActivityIndicator, } from 'react-native';
import { useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config'; // Adjust this path to your Firebase configuration
import { collection, query, where, getDocs } from 'firebase/firestore';


const singup = () => {
  const navigation = useNavigation();
  const [verifysignup, setverifysingup] = useState(false);
  const eamilRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{7,}$/;
  const [user, setuser] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setshowPassword] = useState(false);
  const [userverify, setuserverify] = useState(false);
  const [mailverify, setmailverify] = useState(false);
  const [passwordverify, setpasswordverify] = useState(false);
  const toggleShowPassword = () => {
    setshowPassword(!showPassword);
  };
  const validateemail = (mail) => {
    return eamilRegex.test(mail);
  };

  const validatePassword = (password) => {
    return regex.test(password);
  };
  const singupNext = async () => {
    setuserverify(user.length > 0);
    setmailverify(validateemail(mail));
    setpasswordverify(validatePassword(password));
  
    if (user.length > 0 && validateemail(mail) && validatePassword(password)) {
      try{
        const q = query(collection(db, 'users'), where('mail', '==', mail));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.empty){
          setverifysingup(true);
          console.log("Signup successful");
          navigation.navigate('auth/otp', { user: user, mail: mail, password: password });
        }
        else{
          Alert.alert("Email Alredy Exists","this Email is alredy in use");
        }
      }catch(error){
        console.log("error"+error);
      }
    }
    else {
      console.log("unsuccessful signup");
      setverifysingup(false);
      Alert.alert("Incomplete Data", "Enter proper details");
    }
  };
  
  const login = () => {
    navigation.navigate('auth/login');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={style.container}>
        <View style={{
          alignItems: 'center'
        }}>
          <Image source={require('../../assets/images/singin-logo.png')} style={{
            height: 240,
            width: 280
          }} />
        </View>
        <View style={style.info}>
          <Text style={{
            fontSize: 30,
            textAlign: "center",
            fontWeight: "bold",
            color: "black"
          }}>Sign Up!!!</Text>
          <View style={style.phone}>
            <FontAwesome name="user" size={30} color="black" style={style.icon} />
            <TextInput placeholder='set your user name' style={style.text}
              autoCapitalize='none'
              autoComplete='false'
              onChangeText={setuser}
              maxLength={10}
            />
          </View>
          <View style={style.phone}>
            <Entypo name="email" size={30} color="black" style={style.icon} />
            <TextInput placeholder='enter your gmail' style={style.text}
              value={mail}
              onChangeText={setMail}
              autoCapitalize={false}
              autoCorrect={false}
            />
          </View>
          {!validateemail(mail) && mail.length > 0 && (
            <View style={{
              flexDirection: "row",
              marginHorizontal: 20
            }}>
              <FontAwesome5 name="exclamation-circle" size={15} color="red" />
              <Text style={{
                color: "red",
                fontSize: 13
              }}>Enter a proper email ID</Text>
            </View>
          )}
          <View style={style.phone}>
            <FontAwesome name="lock" size={34} color="black" style={style.icon} />
            <TextInput placeholder='set your password' style={style.text}
              secureTextEntry={!showPassword}
              autoCapitalize='none'
              autoComplete='false'
              onChangeText={setPassword}
              maxLength={15}
            />
            <MaterialCommunityIcons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="black"
              style={{
                position: "absolute",
                right: 10,
                top: 12
              }}
              onPress={toggleShowPassword}
            />
          </View>
          {!validatePassword(password) && password.length > 0 && (
            <View style={{
              flexDirection: "row"
            }}>
              <FontAwesome5 name="exclamation-circle" size={15} color="red" />
              <Text style={{
                color: "red",
                fontSize: 13
              }}>Password must be at least 7 characters long and include both uppercase and lowercase letters</Text>
            </View>
          )}
          <Pressable style={style.btn} onPress={singupNext}>
            <Text style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              letterSpacing: 1
            }}>signup</Text>
          </Pressable>
          <Pressable style={style.btn} onPress={login}>
            <Text style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              letterSpacing: 1
            }}>Login</Text>
          </Pressable>
        </View>
      </SafeAreaView></ScrollView>
  );
};
const style = StyleSheet.create({
  container: {
    backgroundColor: "#e6f7fa",
    flex: 1,
    height: 785
  },
  info: {
    padding: 25,
    marginTop: 15,
    gap: 20,
    elevation: 40,
    backgroundColor: "#f2f7f7",
    borderRadius: 20,
    margin: 10,
    shadowColor: "black"
  },
  phone: {
    borderColor: "black",
    borderWidth: 2,
    flexDirection: "row",
    borderRadius: 20,
    height: 50
  },
  text: {
    width: 200,
    fontSize: 16
  },
  icon: {
    marginHorizontal: 15,
    marginTop: 7
  },
  btn: {
    height: 50,
    width: 230,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#262424",
    marginHorizontal: 35,
  },
});

export default singup;