import React, { useState, useEffect, useRef,useContext } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, TouchableOpacity, Linking, Modal, Pressable, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ChatRoomHeader from './ChatRoomHeader';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import MessageInput from './MessageInput';
import moment from 'moment';
import FullScreenImageModal from './FullScreenImageModal';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo'; // Import NetInfo
import AlertComponent from '../../components/AlertComponent';// Import AlertComponent
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext
import CustomText from '../../components/CustomText';
const { width } = Dimensions.get('window');

const ChatRoom = () => {
  const route = useRoute();
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState('#f8f8f8'); // Default background color
  const [isConnected, setIsConnected] = useState(true); // Track network status
  const [alertVisible, setAlertVisible] = useState(false); // Control alert visibility
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext to access theme

  const flatListRef = useRef(null);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setAlertVisible(true); // Show alert if disconnected
      }
      setIsConnected(state.isConnected);
    });
  
    // Fetch user and messages
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
        (querySnapshot) => {
          if (querySnapshot) {
            const messages = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              createdAt: doc.data().createdAt?.toDate(),
            }));
            setMessages(messages);
            flatListRef.current?.scrollToEnd({ animated: true });
          } else {
            console.warn('No messages found');
          }
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
      );
  
    fetchUser();
  
    // Fetch background color from AsyncStorage or apply dark mode
    const getBackgroundColor = async () => {
      try {
        const storedColor = await AsyncStorage.getItem('selectedColor');
        if (storedColor) {
          setBackgroundColor(storedColor);
        } else {
          // Fallback to isDarkMode if no stored color
          setBackgroundColor(isDarkMode ? '#121212' : '#ffffff');
        }
      } catch (error) {
        console.error('Error fetching background color:', error);
        setBackgroundColor(isDarkMode ? '#121212' : '#ffffff'); // Fallback in case of error
      }
    };
  
    getBackgroundColor(); // Fetch color when the component mounts
  
    return () => {
      fetchMessages();
      unsubscribeNetInfo(); // Unsubscribe when component unmounts
    };
  }, [chatId, userId, isDarkMode]);
  

  const sendMessage = async (messageData) => {
    if (!messageData.text && !messageData.url) return;

    if (!isConnected) {
      setAlertVisible(true); // Show alert if no internet connection
      return;
    }

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

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(part)}>
            <Text style={styles.link}>{part} </Text>
          </TouchableOpacity>
        );
      } else {
        return <Text key={index} style={styles.messageText}>{part} </Text>;
      }
    });
  };

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setIsModalVisible(true);
  };

  const handleCopy = () => {
    Clipboard.setString(selectedMessage.text);
    setIsModalVisible(false);
  };

  const handleDelete = async () => {
    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(selectedMessage.id)
        .delete();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleVoice = () => {
    if (selectedMessage && selectedMessage.text) {
      Speech.speak(selectedMessage.text); // Use the Speech API to read the message aloud
    }
    setIsModalVisible(false);
  };

  const renderItem = ({ item }) => {
    const messageTime = moment(item.createdAt).format('HH:mm');
    let backgroundColor = item.userId === auth().currentUser.uid ? '#DCF8C6' : '#ECECEC';

    return (
      <TouchableOpacity onLongPress={() => handleLongPress(item)}>
        <View style={[item.userId === auth().currentUser.uid ? styles.myMessage : styles.theirMessage, { backgroundColor }]}>
          {item.text ? (
            <View style={styles.textContainer}>
              <Text style={styles.messageText}>{renderMessageText(item.text)}</Text>
              <Text style={styles.messageTime}>{messageTime}</Text>
            </View>
          ) : item.url ? (
            <View>
              {item.type === 'image' ? (
                <TouchableOpacity onPress={() => setSelectedImageUrl(item.url)}>
                  <FastImage source={{ uri: item.url }} style={styles.media} resizeMode={FastImage.resizeMode.cover} />
                </TouchableOpacity>
              ) : item.type === 'video' ? (
                <Video
                  source={{ uri: item.url }}
                  style={styles.media}
                  useNativeControls
                  resizeMode="cover"
                />
              ) : item.type === 'audio' ? (
                <Text style={styles.audioMessage} onPress={() => playAudio(item.url)}>Audio</Text>
              ) : item.type === 'document' ? (
                <Pressable onPress={() => openDocument(item.url)}>
                  <Text style={styles.documentMessage}>{item.name || 'Document'}</Text>
                </Pressable>
              ) : null}
              <Text style={styles.mediaTime}>{messageTime}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar style="auto" />
      <ChatRoomHeader user={user} chatId={chatId} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={<Text style={styles.noMessages}>No messages yet</Text>}
      />
      <MessageInput onSendMessage={sendMessage} />
      {selectedImageUrl && (
        <FullScreenImageModal
          visible={!!selectedImageUrl}
          imageUrl={selectedImageUrl}
          onClose={() => setSelectedImageUrl(null)}
        />
      )}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalContent}>
            <Pressable onPress={handleCopy}>
              <Ionicons name="copy-outline" size={30} color="black" />
              <CustomText fontFamily='pop' style={styles.modalText}>Copy</CustomText>
            </Pressable>
            <Pressable onPress={handleDelete}>
              <Ionicons name="trash-outline" size={30} color="red" />
              <CustomText fontFamily='pop' style={styles.modalText}>Delete</CustomText>
            </Pressable>
            <Pressable onPress={handleVoice}>
              <Ionicons name="mic-outline" size={30} color="black" />
              <CustomText fontFamily='pop' style={styles.modalText}>Voice</CustomText>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      {/* Alert Component */}
      {alertVisible && (
        <AlertComponent
          title="No Internet Connection"
          message="You are currently offline. Please check your network settings."
          onConfirm={() => {
            setAlertVisible(false);
            // Retry or other logic on confirm
          }}
          confirmText={'Retry'}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
  },
  noMessages: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  myMessage: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  media: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
    marginBottom: 5,
  },
  mediaTime: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#555',
  },
  textContainer: {
    flexDirection: 'column',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalText: {
    fontSize: 16,
    marginTop: 10,
  },
  modalDeleteText: {
    color: 'red',
  },
  audioMessage: {
    fontSize: 16,
    color: '#555',
  },
  documentMessage: {
    fontSize: 16,
    color: '#555',
  },
});

export default ChatRoom;
