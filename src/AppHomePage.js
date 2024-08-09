import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomText from './components/CustomText';
import AppHeader from "./components/AppHeader";
const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

export default function HomeScreen() {
  const [chatList, setChatList] = useState([]);
  const navigation = useNavigation();

  const fetchChatList = async () => {
    try {
      const currentUser = auth().currentUser.uid;
      const chatListSnapshot = await firestore().collection('friends')
        .where('userId', '==', currentUser)
        .get();
  
      const chatListData = chatListSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          friendId: data.friendId,
          avatar: data.avatar, // Fetch the avatar
          ...data,
        };
      });
  
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
        <CustomText fontFamily={'pop'} style={styles.name}>  {item.friendId}   </CustomText>
        <CustomText fontFamily={'lato-bold'} style={styles.time}>{item.time || 'N/A'} </CustomText>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.container}>
      <AppHeader showCameraIcon={true} title={'FlapTalk'} textColor={'#00ae59'}/>
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
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
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
