import { View, Text, Image, Pressable, ActivityIndicator, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, StatusBar } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../app/config';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native'; // Add this

const Header = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const profileNext = () => {
    router.push("screens/profile");
  }
  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        const userDoc = doc(db, 'users', email);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('No email found in AsyncStorage');
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch the data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData(); // This will trigger every time the screen is focused
    }, [])
  );


  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#2f3030" />
      <View style={{ backgroundColor: "#2f3030", height: 75, justifyContent: "flex-end" }}>
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 30, marginLeft: 15, }}>TALK</Text>

          <Pressable onPress={profileNext}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 16, marginBottom: 10 }} />
            ) : (
              <Image
                source={userDetails?.profileImage
                  ? { uri: userDetails.profileImage }
                  : require("../assets/images/icon.png")}
                style={{
                  width: 45,
                  height: 45,
                  borderWidth: 1.5,
                  borderColor: "white",
                  borderRadius: 50,
                  marginBottom: 10,
                  marginRight: 16,
                }}
              />
            )}
          </Pressable>
        </View>
      </View></>

  );
};



export default Header;