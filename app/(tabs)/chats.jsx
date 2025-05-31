import { View, Text, FlatList, StyleSheet, Pressable, Image, ActivityIndicator, RefreshControl, Button,StatusBar } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';

const Chats = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setCurrentUserEmail(email);

      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const filteredUsers = userList.filter(user => user.mail !== email);
      setUsers(filteredUsers);
    } catch (err) {
      setError("Failed to load users.");
      console.error("Error fetching users: ", err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllUsers().then(() => setRefreshing(false));
  }, []);

  const handlePress = (item) => {
    const chatId = [currentUserEmail, item.mail].sort().join('_');
    navigation.navigate("screens/chatpage", { details: item, chatId });
  };

  const RenderCard = React.memo(({ item }) => (
    <Pressable
      style={styles.userItem}
      onPress={() => handlePress(item)}
      accessibilityLabel={`Chat with ${item.user}`}
      accessibilityRole="button"
    >
      {item.profileImage ? (
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user}</Text>
        <Text style={styles.userEmail}>{item.mail}</Text>
      </View>
    </Pressable>
  ));

  useEffect(() => {
    getAllUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={getAllUsers} />
      </View>
    );
  }

  if (users.length === 0) {
    return <Text style={styles.emptyText}>No users available</Text>;
  }

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="#2f3030" />
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <RenderCard item={item} />}
        keyExtractor={(item) => item.mail}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#e6f7fa",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImage: {
    width: 59,
    height: 59,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
  },
});

export default Chats;