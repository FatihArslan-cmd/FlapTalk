import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from "@react-navigation/native";
import CustomText from '../../components/CustomText';
import AppHeader from "../../components/AppHeader";
import moment from 'moment'; 
import useDisableBackButton from "../../hooks/useDisableBackButton";
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import SkeletonPlaceholder from "../../components/Skeleton";
import FastImage from 'react-native-fast-image';
import useNavigationBarSync from "../../hooks/useNavigationBarSync";
import { useTranslation } from "react-i18next";
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';
const placeholderImage = require('../../../assets/delete_16321346.png'); // Update path to your asset image

export default function HomeScreen() {
  const [chatList, setChatList] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]); // State to store favorites
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // Filter state
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext to check theme mode

  const backgroundColor = isDarkMode ? '#121212' : '#FAF9F6'; 
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
            navigation.navigate('LoginScreen');
            return;
          }

          const currentUserData = await firestore().collection('users').doc(currentUser.uid).get();
          const currentUserProfile = currentUserData.data();

          if (!currentUserProfile || !currentUserProfile.username) {
            navigation.navigate('LoginScreen');
            return;
          }

          const friendsListData = await Promise.all(snapshot.docs.map(async doc => {
            const data = doc.data();
            const friendSnapshot = await firestore().collection('users').doc(data.friendId).get();
            const friendData = friendSnapshot.data();

            if (!friendData) return null;

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
              : { text: t('No messages found'), createdAt: null, type: 'text' }; // Using t for "No messages yet"

            let latestMessage = '';
            if (latestMessageData.type === 'image') {
              latestMessage = t('image'); // Translated "Image"
            } else if (latestMessageData.type === 'video') {
              latestMessage = t('video'); // Translated "Video"
            } else if (latestMessageData.type === 'audio') {
              latestMessage = t('audio'); // Translated "Audio"
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

          const favoritesSnapshot = await firestore()
            .collection('favorites')
            .where('userId', '==', currentUser.uid)
            .get();

          const favoritesList = favoritesSnapshot.docs.map(doc => doc.data().friendId);

          // Set both friends and favorites in state
          setChatList(friendsListData.filter(item => item !== null));
          setFavoritesList(favoritesList);

        } catch (error) {
          console.error('Error fetching chat list:', error);
          Alert.alert('Error', 'An error occurred while loading the chat list.');
        } finally {
          setLoading(false);
        }
      });

    return () => unsubscribe();
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
        <Text style={styles.actionText}>{t('Delete')}</Text>
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
      <TouchableOpacity style={[styles.item, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]} onPress={() => startChat(item.friendId)}>
        <FastImage 
          source={{ uri: item.avatar || defaultAvatar }} 
          style={styles.avatar} 
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.messageContainer}>
          <CustomText fontFamily={'pop'} style={[styles.name, { color: isDarkMode ? 'white' : 'black' }]}>{item.username}</CustomText>
          <View style={styles.latestMessageContainer}>
            <CustomText fontFamily={'lato-bold'} style={[styles.latestMessage, { color: isDarkMode ? '#E0E0E0' : '#555' }]}>{item.latestMessage}</CustomText>
            <CustomText fontFamily={'lato-bold'} style={[styles.latestMessageTime, { color: isDarkMode ? '#B0B0B0' : '#999' }]}>{item.latestMessageTime}</CustomText>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  // Filter based on the selected filter and search text
  const filteredChatList = chatList.filter(chat => {
    if (filter === 'Favorites') {
      return favoritesList.includes(chat.friendId);
    }
    return chat.username.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AppHeader title={'FlapTalk'} textColor={'#00ae59'} onSearch={setSearchText} />
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'All' && styles.activeFilterButton]}
          onPress={() => setFilter('All')}
        >
          <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText, { color: isDarkMode ? '#E0E0E0' : '#555' }]}>{t('All')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'Favorites' && styles.activeFilterButton]} 
          onPress={() => setFilter('Favorites')}
        >
          <Text style={[styles.filterText, filter === 'Favorites' && styles.activeFilterText, { color: isDarkMode ? '#E0E0E0' : '#555' }]}>{t('favorites')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={loading ? Array.from({ length: 5 }) : filteredChatList}
        renderItem={loading ? renderSkeletonItem : renderChatItem}
        keyExtractor={(item, index) => item?.friendId || index.toString()}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Image 
                source={placeholderImage} 
                style={styles.placeholderImage} 
                resizeMode='cover'
              />
              <Text style={styles.emptyText}>{t('No chats available')}</Text>
            </View>
          ) : null
        }
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
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  latestMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  latestMessage: {
    fontSize: 14,
    flex: 1,
  },
  latestMessageTime: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  placeholderImage: {
    width: 100,
    height: 100,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: '100%',
    borderRadius: 33,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    
  },
  filterButton: {
    padding: 10,
  },
  filterText: {
    fontSize: 16,
  },
  activeFilterButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#00ae59',
  },
  activeFilterText: {
    fontWeight: '600',
  },
});
