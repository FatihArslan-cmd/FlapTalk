import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import CustomText from './components/CustomText';
import AppHeader from "./components/AppHeader";
import moment from 'moment'; 
import useDisableBackButton from "./hooks/useDisableBackButton";
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import SkeletonPlaceholder from "../Skeleton";
import FastImage from 'react-native-fast-image';
import useNavigationBarSync from "./hooks/useNavigationBarSync";
const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

export default function HomeScreen() {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // Add state for the selected filter
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const backgroundColor = styles.container.backgroundColor; 
  useNavigationBarSync(backgroundColor); 
  useDisableBackButton();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('friends')
      .where('userId', '==', auth().currentUser?.uid)
      .onSnapshot(async snapshot => {
        setLoading(true);
        try {
          const currentUser = auth().currentUser;
  
          if (!currentUser) {
            // If the user is not logged in, navigate to the login screen
            navigation.navigate('LoginScreen');
            return;
          }
  
          const currentUserData = await firestore().collection('users').doc(currentUser.uid).get();
          const currentUserProfile = currentUserData.data();
  
          if (!currentUserProfile || !currentUserProfile.username) {
            // If the user's username is missing, navigate to the login screen
            navigation.navigate('LoginScreen');
            return;
          }
  
          const chatListData = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            const friendSnapshot = await firestore().collection('users').doc(data.friendId).get();
            const friendData = friendSnapshot.data();
  
            if (!friendData) return null; // Handle potential null data
  
            const chatId = [currentUser.uid, data.friendId].sort().join('_');
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
  
            let latestMessage = '';
            if (latestMessageData.type === 'image') {
              latestMessage = 'Image';
            } else if (latestMessageData.type === 'video') {
              latestMessage = 'Video';
            } else if (latestMessageData.type === 'audio') {
              latestMessage = 'Audio';
            } else {
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
              latestMessage: latestMessage,
              latestMessageTime: latestMessageTime,
            };
          }));
  
          // Filter out any null values in the chatListData
          setChatList(chatListData.filter(item => item !== null));
        } catch (error) {
          console.error('Error fetching chat list:', error);
          Alert.alert('Error', 'An error occurred while loading the chat list.');
        } finally {
          setLoading(false);
        }
      });
  
    return () => unsubscribe(); // Clean up the listener on unmount
  }, [navigation]);
  
  
  

  const startChat = (userId) => {
    const chatId = [auth().currentUser.uid, userId].sort().join('_');
    navigation.navigate('ChatRoom', { chatId, userId });
  };

  const removeFriendAndDeleteChat = async (friendId) => {
    try {
      const currentUser = auth().currentUser.uid;

      await firestore()
        .collection('friends')
        .where('userId', '==', currentUser)
        .where('friendId', '==', friendId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        });

      const chatId = [currentUser, friendId].sort().join('_');
      const chatMessages = await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .get();
      chatMessages.forEach(async doc => {
        await doc.ref.delete();
      });

      Alert.alert('Success', 'Friend removed and chat deleted.');
    } catch (error) {
      console.error('Error removing friend and deleting chat:', error);
    }
  };

  const renderRightActions = (friendId) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.deleteAction} onPress={() => removeFriendAndDeleteChat(friendId)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeletonItem = () => (
    <View style={styles.item}>
      <SkeletonPlaceholder width={50} height={50} borderRadius={15} />
      <View style={styles.messageContainer}>
        <SkeletonPlaceholder width={100} height={20} borderRadius={4} />
        <SkeletonPlaceholder width={150} height={15} borderRadius={4} />
      </View>
    </View>
  );

  const renderChatItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.friendId)}>
      <TouchableOpacity style={styles.item} onPress={() => startChat(item.friendId)}>
        <FastImage 
          source={{ uri: item.avatar || defaultAvatar }} 
          style={styles.avatar} 
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.messageContainer}>
          <CustomText fontFamily={'pop'} style={styles.name}>{item.username}</CustomText>
          <View style={styles.latestMessageContainer}>
            <CustomText fontFamily={'lato-bold'} style={styles.latestMessage}>{item.latestMessage}</CustomText>
            <CustomText fontFamily={'lato-bold'} style={styles.latestMessageTime}>{item.latestMessageTime}</CustomText>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const filteredChatList = chatList.filter(chat =>
    chat.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <AppHeader title={'FlapTalk'} textColor={'#00ae59'} onSearch={setSearchText} />
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'All' && styles.activeFilterButton]}
          onPress={() => setFilter('All')}
        >
          <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'Favorites' && styles.activeFilterButton]}
          onPress={() => setFilter('Favorites')}
        >
          <Text style={[styles.filterText, filter === 'Favorites' && styles.activeFilterText]}>Favorites</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <FlatList
          data={[...Array(10).keys()]}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeletonItem}
        />
      ) : (
        <FlatList
          data={filteredChatList}
          keyExtractor={(item) => item.friendId}
          renderItem={renderChatItem}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No chats found</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FAF9F6',
  },
  item: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  messageContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: '#333',
  },
  latestMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  latestMessage: {
    fontSize: 14,
    color: '#999',
  },
  latestMessageTime: {
    fontSize: 12,
    color: '#999',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FAF9F6',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeFilterButton: {
    backgroundColor: '#00ae59',
  },
  filterText: {
    fontSize: 16,
    color: '#00ae59',
  },
  activeFilterText: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
  actionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    margin: 10,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
});

