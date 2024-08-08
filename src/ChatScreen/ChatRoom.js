import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChatRoomHeader from './ChatRoomHeader';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

const ChatRoom = () => {
  const route = useRoute();
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUser(userDoc.data());
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchMessages = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot) {
            const messages = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
            }));
            setMessages(messages);
          } else {
            console.warn('No messages found');
          }
        },
        error => {
          console.error('Error fetching messages:', error);
        }
      );

    fetchUser();

    return () => fetchMessages();
  }, [chatId, userId]);

  const sendMessage = async () => {
    if (newMessage.trim().length === 0) return;

    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: newMessage,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: auth().currentUser.uid,
        });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.userId === auth().currentUser.uid ? styles.myMessage : styles.theirMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaWrapper style={styles.container}>
      <StatusBar style="auto" />
      <ChatRoomHeader user={user} />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#007AFF',
    borderRadius: 25,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
});

export default ChatRoom;
