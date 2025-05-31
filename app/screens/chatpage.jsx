import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../config';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { IP } from '../config';

const ChatPage = () => {
  const route = useRoute();
  const { details, chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [userLanguage, setUserLanguage] = useState('en'); 
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem('userEmail');
        setCurrentUserEmail(email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    const fetchUserLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('language') || 'en'; 
        setUserLanguage(lang);
      } catch (error) {
        console.error('Error fetching user language:', error);
      }
    };

    fetchCurrentUserEmail();
    fetchUserLanguage();
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'chats'), where('chatId', '==', chatId)),
        async (querySnapshot) => {
          const messagesList = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const data = doc.data();
              if (data.sender !== currentUserEmail) {
                const translatedText = await translateMessage(data.text, userLanguage); 
                return { id: doc.id, ...data, text: translatedText };
              }
              return { id: doc.id, ...data };
            })
          );

          messagesList.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
          setMessages(messagesList);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [chatId, currentUserEmail, userLanguage]);

  const translateMessage = async (message, targetLang) => {
    try {
      const response = await axios.post(`http://${IP}:5000/trans`, {
        targetlan: targetLang,
        msg: message,
      });
      return response.data.translated;
    } catch (error) {
      console.error('Error translating message:', error.response?.data || error.message);
      return message; 
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      setSending(true);
  
      try {
        const response = await axios.post(`http://${IP}:5000/censor`, {
          message: message,
        });
  
        const censoredMessage = response.data.censored; 
  
     
        await addDoc(collection(db, "chats"), {
          chatId,
          text: censoredMessage, 
          sender: currentUserEmail,
          timestamp: new Date(),
        });
  
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
  
      setSending(false);
    }
  };
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.sender === currentUserEmail ? styles.myMessage : styles.otherMessage
          ]}>
      
            <View style={styles.messageContent}>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={sending || !message.trim()}>
          <FontAwesome name="send" size={26} color="white"/>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    maxWidth: '80%',
    borderRadius: 15,
    padding: 10,
    marginHorizontal: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginTop:15,
  },
  myMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#2f3030',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#f1f0f0',
    marginRight: 10,
  },
  sendButton: {
    padding: 5,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageContent: {
    flexDirection: 'column',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 3,
    alignSelf: 'flex-end',
  },
});

export default ChatPage;
//real