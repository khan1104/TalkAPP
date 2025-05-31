import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {db} from "../config"
import { deleteDoc, doc } from 'firebase/firestore'; // Import deleteDoc and doc

const Settings = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await AsyncStorage.getItem('language'); // Get language from AsyncStorage
      if (lang) {
        setSelectedLanguage(lang);
      } else {
        setSelectedLanguage('en'); // Default language
      }
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang); // Store selected language in AsyncStorage
      Alert.alert("Success", "Language preference updated!");
    } catch (error) {
      console.error("Error updating language: ", error);
      Alert.alert("Error", "Failed to update language preference.");
    }
  };

  const handleFeedback = () => {
    Alert.alert("Feedback", "Thank you for your feedback!");
  };

  const handleAccountSettings = () => {
    router.navigate("screens/profile");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Loggin Out",
      "Logging out would not delete TALK account",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "LogOut", onPress: async () => {
            await AsyncStorage.clear(); // Clear all AsyncStorage data
            router.replace("auth/login");
          }
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", onPress: async () => {
              try {
                const email = await AsyncStorage.getItem("userEmail");
                await deleteDoc(doc(db, 'users', email)); // Assuming you still want to delete from Firebase
                Alert.alert('Success', 'Account deleted Successfully');
                await AsyncStorage.clear(); // Clear user data
                router.replace("auth/login");
              } catch (error) {
                console.error('Error deleting document: ', error);
                Alert.alert('Error', 'Failed to delete document.');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* Language Selection */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>App Language</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={styles.picker}
          onValueChange={handleLanguageChange}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Spanish" value="es" />
          <Picker.Item label="French" value="fr" />
          <Picker.Item label="Arabic" value="ar" />
          <Picker.Item label="Bengali" value="bn" />
          <Picker.Item label="Korean" value="ko" />
          <Picker.Item label="Russian" value="ru" />
          <Picker.Item label="Hindi" value="hi" />
          <Picker.Item label="Gujarati" value="gu" />
          <Picker.Item label="Tamil" value="ta" />
          <Picker.Item label="Turkish" value="tr" />
        </Picker>
      </View>

      {/* Account Settings */}
      <Pressable style={[styles.settingItem, styles.extra]} onPress={handleAccountSettings}>
        <MaterialIcons name="app-settings-alt" size={28} color="black" />
        <Text style={styles.settingText}>Account Settings</Text>
      </Pressable>

      {/* Feedback */}
      <Pressable style={[styles.settingItem, styles.extra]} onPress={handleFeedback}>
        <MaterialIcons name="feedback" size={27} color="black" />
        <Text style={styles.settingText}>Send Feedback</Text>
      </Pressable>

      {/* Logout */}
      <Pressable style={[styles.settingItem, styles.extra]} onPress={handleLogout}>
        <MaterialIcons name="logout" size={27} color="black" />
        <Text style={styles.settingText}>Logout</Text>
      </Pressable>

      {/* Delete Account */}
      <Pressable style={[styles.settingItem, styles.extra]} onPress={handleDeleteAccount}>
        <MaterialIcons name="delete" size={27} color="red" />
        <Text style={[styles.settingText, styles.deleteText]}>Delete Account</Text>
      </Pressable>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e6f7fa',
  },
  title: {
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 20
  },
  extra: {
    flexDirection: "row"
  },
  settingText: {
    fontSize: 22,
    marginHorizontal: 5
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: 150,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666',
  },
});

export default Settings;