import React, { useState,useEffect} from 'react';
import Slider from '../components/slider'; // Import the Slider component
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useNavigation,useRouter } from "expo-router";
const App = () => {
  const router = useRouter();
  useEffect(() => {
    const checkLoggedInStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      console.log(isLoggedIn);
      if (isLoggedIn) {
        router.replace('chats'); // Replace to prevent going back
      }
    };
    checkLoggedInStatus();
  }, []);
  return (
      <Slider/>
  );
};

export default App;