import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text,Dimensions } from 'react-native'; 
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChatRoomHeader from './ChatRoomHeader';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import MessageInput from './MessageInput';

const { width } = Dimensions.get('window');


const ChatRoom = () => {
  const route = useRoute();
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null); // Create a ref for FlatList

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
            flatListRef.current?.scrollToEnd({ animated: true }); // Scroll to the end on new messages
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

  const sendMessage = async (message) => {
    if (message.trim().length === 0) return;

    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: message,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: auth().currentUser.uid,
        });
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
        ref={flatListRef} // Attach the ref to FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={<Text style={styles.noMessages}>No messages yet</Text>} // Handle empty state
      />
      <MessageInput onSendMessage={sendMessage} />
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
    myMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#DCF8C6',
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      maxWidth: width * 0.75, // 75% of the screen width
    },
    theirMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#ECECEC',
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      maxWidth: width * 0.75, // 75% of the screen width
    },
    messageText: {
      fontSize: 16,
    },
    noMessages: {
      textAlign: 'center',
      fontSize: 16,
      color: 'gray',
    },
  });

export default ChatRoom;
