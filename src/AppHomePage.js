import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomText from './components/CustomText';
import AppHeader from "./components/AppHeader";
import moment from 'moment'; // Import moment for formatting the time

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

export default function HomeScreen() {
  const [chatList, setChatList] = useState([]);
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const fetchChatList = async () => {
    try {
      const currentUser = auth().currentUser.uid;
      const chatListSnapshot = await firestore().collection('friends')
        .where('userId', '==', currentUser)
        .get();
  
      const chatListData = await Promise.all(chatListSnapshot.docs.map(async doc => {
        const data = doc.data();
        const friendSnapshot = await firestore().collection('users').doc(data.friendId).get();
        const friendData = friendSnapshot.data();
  
        // Fetch the latest message and its timestamp
        const chatId = [auth().currentUser.uid, data.friendId].sort().join('_');
        const messagesSnapshot = await firestore()
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();
  
        const latestMessageData = messagesSnapshot.docs.length > 0 
          ? messagesSnapshot.docs[0].data() 
          : { text: 'No messages yet', createdAt: null, type: 'text' };
  
        // Handle different message types
        let latestMessage = '';
        
        if (latestMessageData.type === 'image') {
          latestMessage = 'Image';
        } else if (latestMessageData.type === 'video') {
          latestMessage = 'Video';
        } else if (latestMessageData.type === 'audio') {
          latestMessage = 'Audio';
        }
        else  {
          latestMessage = latestMessageData.text.length > 40 
            ? latestMessageData.text.substring(0, 40) + '...' 
            : latestMessageData.text;
        }
        const latestMessageTime = latestMessageData.createdAt 
          ? moment(latestMessageData.createdAt.toDate()).format('HH:mm') 
          : '';
  
        return {
          friendId: data.friendId,
          avatar: friendData.avatar || defaultAvatar,
          username: friendData.username,
          latestMessage: latestMessage, // Include the message type or truncated text
          latestMessageTime: latestMessageTime, // Include the latest message time
        };
      }));
  
      setChatList(chatListData);
    } catch (error) {
      console.error('Error fetching chat list:', error);
    }
  };
  
  
  useFocusEffect(
    useCallback(() => {
      fetchChatList();
    }, [])
  );

  const startChat = (userId) => {
    const chatId = [auth().currentUser.uid, userId].sort().join('_');
    navigation.navigate('ChatRoom', { chatId, userId });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => startChat(item.friendId)}>
      <Image source={{ uri: item.avatar || defaultAvatar }} style={styles.avatar} />
      <View style={styles.messageContainer}>
        <CustomText fontFamily={'pop'} style={styles.name}>{item.username} </CustomText>
        <View style={styles.latestMessageContainer}>
          <CustomText fontFamily={'lato-bold'} style={styles.latestMessage}> {item.latestMessage} </CustomText>
          <CustomText fontFamily={'lato-bold'} style={styles.latestMessageTime}>{item.latestMessageTime} </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Filter chat list based on the search text
  const filteredChatList = chatList.filter(chat =>
    chat.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <AppHeader showCameraIcon={true} title={'FlapTalk'} textColor={'#00ae59'} onSearch={setSearchText}/>
      <FlatList
        data={filteredChatList} // Use the filtered chat list here
        keyExtractor={(item) => item.friendId}
        renderItem={renderChatItem}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  latestMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  latestMessage: {
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  latestMessageTime: {
    color: '#888',
    fontSize: 12,
    marginLeft: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
});
