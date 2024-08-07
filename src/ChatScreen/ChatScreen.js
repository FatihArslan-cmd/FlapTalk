import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import firestore from '@react-native-firebase/firestore';

export default function ChatScreen({ route }) {
  const { chatId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().timestamp.toDate(),
          user: {
            _id: doc.data().userId,
            name: doc.data().username,
          }
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, [chatId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      await firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          text: newMessage,
          timestamp: firestore.FieldValue.serverTimestamp(),
          userId,
          username: 'User', // Kullanıcı adını buradan alın
        });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.messageUser}>{item.user.name}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    marginBottom: 10,
  },
  messageUser: {
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginRight: 10,
  },
});
