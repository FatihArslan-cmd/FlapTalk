import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions, Image, TouchableOpacity, Linking, Alert, Modal, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons'; // Updated: Imported icons
import ChatRoomHeader from './ChatRoomHeader';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import MessageInput from './MessageInput';
import moment from 'moment';
import FullScreenImageModal from './FullScreenImageModal';
import * as Clipboard from 'expo-clipboard'; // Import Clipboard API
import { MaterialIcons } from '@expo/vector-icons'; // Import icons from Material Icons

const { width } = Dimensions.get('window');

const ChatRoom = () => {
  const route = useRoute();
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null); // For storing the selected message

  const flatListRef = useRef(null);

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
              createdAt: doc.data().createdAt?.toDate(),
            }));
            setMessages(messages);
            flatListRef.current?.scrollToEnd({ animated: true });
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

  const copyToClipboard = (text) => {
    Clipboard.setStringAsync(text);
    Alert.alert('Copied to Clipboard', 'The message has been copied to your clipboard.');
  };

  const deleteMessage = async (messageId) => {
    try {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .doc(messageId)
        .delete();
      Alert.alert('Deleted', 'The message has been deleted.');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
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

  const renderItem = ({ item }) => {
    const messageTime = moment(item.createdAt).format('HH:mm');
    let backgroundColor = item.userId === auth().currentUser.uid ? '#DCF8C6' : '#ECECEC';

    return (
      <TouchableOpacity onLongPress={() => handleLongPress(item)}>
        <View style={[item.userId === auth().currentUser.uid ? styles.myMessage : styles.theirMessage, { backgroundColor }]}>
          {item.text ? (
            <View style={styles.textContainer}>
              <Text style={styles.messageText}>{renderMessageText(item.text)} </Text>
              <Text style={styles.messageTime}>{messageTime} </Text>
            </View>
          ) : item.url ? (
            <View>
              {item.type === 'image' ? (
                <TouchableOpacity onPress={() => setSelectedImageUrl(item.url)}>
                  <Image source={{ uri: item.url }} style={styles.media} />
                </TouchableOpacity>
              ) : item.type === 'video' ? (
                <Video
                  source={{ uri: item.url }}
                  style={styles.media}
                  useNativeControls
                  resizeMode="cover"
                />
              ) : item.type === 'audio' ? (
                <Text style={styles.audioMessage} onPress={() => playAudio(item.url)}>Audio </Text>
              ) : item.type === 'document' ? (
                <Pressable onPress={() => openDocument(item.url)}>
                  <Text style={styles.documentMessage}>{item.name || 'Document'} </Text>
                </Pressable>
              ) : null}
              <Text style={styles.mediaTime}>{messageTime} </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ChatRoomHeader user={user} chatId={chatId} />
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={<Text style={styles.noMessages}>No messages yet </Text>}
      />
      <MessageInput onSendMessage={sendMessage} />
      {selectedImageUrl && (
        <FullScreenImageModal
          visible={!!selectedImageUrl}
          imageUrl={selectedImageUrl}
          onClose={() => setSelectedImageUrl(null)}
        />
      )}
      {selectedMessage && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable onPress={() => { copyToClipboard(selectedMessage.text); setModalVisible(false); }}>
                <MaterialIcons name="content-copy" size={30} color="black" />
                <Text style={styles.modalText}>Copy </Text>
              </Pressable>
              <Pressable onPress={() => { deleteMessage(selectedMessage.id); setModalVisible(false); }}>
                <MaterialIcons name="delete" size={30} color="black" />
                <Text style={styles.modalText}>Delete </Text>
              </Pressable>
              <Pressable onPress={() => { /* Handle voice action */ setModalVisible(false); }}>
                <MaterialIcons name="mic" size={30} color="black" />
                <Text style={styles.modalText}>Voice </Text>
              </Pressable>
              <Pressable onPress={() => setModalVisible(false)}>
              <Ionicons name="close-outline" size={30} color="black" />
              <Text style={styles.modalText}>Close </Text>
            </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
  audioMessage: {
    fontSize: 16,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  myMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'column',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: width * 0.75,
    flexShrink: 1,
    overflow: 'hidden',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#ECECEC',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: width * 0.75,
    flexShrink: 1,
    overflow: 'hidden',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  messageText: {
    fontSize: 16,
    flexShrink: 1,
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  mediaTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    textAlign: 'right',
  },
  media: {
    width: width * 0.70,
    height: 200,
    borderRadius: 10,
    marginVertical: 5,
  },
  noMessages: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
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
    textAlign: 'center',
    marginTop: 5,
    fontSize: 14,
    color: 'black',
  },
});

export default ChatRoom;
