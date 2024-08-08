import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');


const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleTextChange = (text) => {
    setMessage(text);
  };

  const handleSendPress = () => {
    onSendMessage(message); // Call the sendMessage function passed as a prop
    setMessage(''); // Clear the TextInput after sending the message
  };

  return (
    <View style={styles.container}>
      <Icon name="insert-emoticon" size={30} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Mesaj"
        value={message}
        onChangeText={handleTextChange}
      />
      <TouchableOpacity>
        <Icon
          name="photo-camera"
          size={30}
          color="gray"
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSendPress} disabled={message.length === 0}>
        <Icon
          name={message.length > 0 ? "send" : "mic"}
          size={30}
          color={message.length > 0 ? "#00ae59" : "gray"}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: width * 0.03, // Adjust padding based on screen width
      backgroundColor: '#fff',
      borderRadius: 25,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    icon: {
      marginHorizontal: width * 0.02, // Adjust margin based on screen width
    },
    input: {
      flex: 1,
      paddingHorizontal: width * 0.03, // Adjust padding based on screen width
      fontSize: 16,
    },
  });

export default MessageInput;
