import { View, Text, Image, SafeAreaView, Pressable, ActivityIndicator, StyleSheet, Alert, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, storage } from '../config'; // Import Firestore and Storage
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newBio, setNewBio] = useState("");

  const fetchData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setNewEmail(email);
      if (email) {
        const userDoc = doc(db, 'users', email);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          Alert.alert('Error', 'No such document!');
        }
      } else {
        Alert.alert('Error', 'No email found in AsyncStorage');
      }
    } catch (error) {
      Alert.alert('Error fetching user data', error.message);
    }
  };

  const updateBio = async () => {
    try {
      await updateDoc(doc(db, 'users', newEmail), { bio: newBio });
      setUserDetails(prev => ({ ...prev, bio: newBio }));
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error updating bio', error.message);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (imageUri) => {
    setIsUploading(true);
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);

    const storageRef = ref(storage, `profile_images/${filename}`);
    try {
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);
      await updateDoc(doc(db, 'users', newEmail), { profileImage: imageUrl });
      setUserDetails(prev => ({ ...prev, profileImage: imageUrl }));
    } catch (error) {
      Alert.alert('Error uploading image', error.message);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {isUploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Image
            source={userDetails?.profileImage
              ? { uri: userDetails.profileImage }
              : require("../../assets/images/icon.png")}
            style={styles.profileImage}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{userDetails?.user || 'User Name'}</Text>
        <Text style={styles.userEmail}>{userDetails?.mail || 'User Email'}</Text>
        <Text style={styles.userBio}>{userDetails?.bio || 'This is your bio. Tap to edit!'}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={pickImage} disabled={isUploading}>
          <Text style={styles.buttonText}>
            {isUploading ? 'Updating...' : 'Update Image'}
          </Text>
        </Pressable>
        <Pressable style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit Bio</Text>
        </Pressable>
      </View>

      {/* Modal for updating bio */}
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
            <Text style={styles.modalText}>Update Your Bio</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your new bio"
              value={newBio}
              onChangeText={setNewBio}
            />
            <Pressable style={styles.saveButton} onPress={updateBio}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7fa',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: "black",
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  userName: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: "center",
    color: '#222',
  },
  userEmail: {
    fontSize: 22,
    textAlign: "center",
    color: '#666',
    marginTop: 5,
  },
  userBio: {
    fontSize: 20,
    textAlign: "center",
    color: '#888',
    marginTop: 20,
    marginHorizontal: 20,
    fontStyle: 'italic',
    width:350
  },
  buttonContainer: {
    justifyContent: "flex-end",
    height: 150,
    margin: "auto",
    alignItems: 'center',
  },
  button: {
    borderColor: "black",
    borderWidth: 2,
    height: 50,
    width: 230,
    borderRadius: 25,
    backgroundColor: "#262424",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  editButton: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    height: 50,
    width: 230,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    marginTop:240,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width:340,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: 290,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 10,
    width: 100,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#f44336",
    borderRadius: 10,
    padding: 10,
    width: 100,
    alignItems: 'center',
  },
});

export default Profile;