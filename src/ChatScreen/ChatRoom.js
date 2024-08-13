import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions,Image } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChatRoomHeader from './ChatRoomHeader';
import { StatusBar } from 'expo-status-bar';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import MessageInput from './MessageInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment'; // Import moment for formatting the time

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
              createdAt: doc.data().createdAt?.toDate(), // Convert Firestore timestamp to JS Date
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

  const sendMessage = async (messageData) => {
    if (!messageData.text && !messageData.url) return;
  
    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          ...messageData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          userId: auth().currentUser.uid,
        });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const renderItem = ({ item }) => {
    const messageTime = moment(item.createdAt).format('HH:mm');
  
    return (
      <View style={item.userId === auth().currentUser.uid ? styles.myMessage : styles.theirMessage}>
        {item.text ? (
          <Text style={styles.messageText}>{item.text} </Text>
        ) : item.url ? (
          item.type === 'image' ? (
            <Image source={{ uri: item.url }} style={styles.media} />
          ) : (
            <Video
              source={{ uri: item.url }}
              style={styles.media}
              useNativeControls
            />
          )
        ) : null}
        <Text style={styles.messageTime}> {messageTime} </Text>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ChatRoomHeader user={user} chatId={chatId} />
      <FlatList
        ref={flatListRef} // Attach the ref to FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={<Text style={styles.noMessages}>No messages yet</Text>} // Handle empty state
      />
      <MessageInput onSendMessage={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  messagesContainer: {
    padding: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: width * 0.75, // 75% of the screen width
    flexShrink: 1, // Allow the message container to shrink if necessary
  },
  media: {
    width: width * 0.70,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: width * 0.75, // 75% of the screen width
    flexShrink: 1, // Allow the message container to shrink if necessary
  },
  messageText: {
    fontSize: 16,
    flexShrink: 1, // Allow text to wrap within the container
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    marginLeft: 5,
    textAlign: 'right',
    alignSelf: 'flex-end', // Ensure timestamp aligns to the end of the message container
  },
  noMessages: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});

export default ChatRoom;
