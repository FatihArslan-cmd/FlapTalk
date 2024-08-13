import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image ,Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmojiKeyboard from 'rn-emoji-keyboard';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import storage from '@react-native-firebase/storage'; // Import Firebase Storage

const { width } = Dimensions.get('window');

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);

  const handleTextChange = (text) => {
    setMessage(text);
  };

  const handleSendPress = () => {
    onSendMessage({ text: message });
    setMessage('');
  };

  const handleEmoticonPress = () => {
    setShowEmojiKeyboard(!showEmojiKeyboard);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prevMessage => prevMessage + emoji);
    setShowEmojiKeyboard(false);
  };

  const handleMediaSelect = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need camera roll permissions to make this work!');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });
  
      if (!result.canceled) {
        const { uri, type } = result.assets[0] || {}; // Access the assets array
        if (!uri) {
          Alert.alert('Error', 'Failed to select media.');
          return;
        }
  
        const fileName = uri.split('/').pop();
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
  
        // Generate a unique path to save the file in Firebase Storage
        const path = `media/${Date.now()}_${fileName}`;
        
        // Upload the media file to Firebase Storage
        const reference = storage().ref(path);
        await reference.putFile(uploadUri);
  
        // Get the URL of the uploaded file
        const downloadURL = await reference.getDownloadURL();
  
        // Send the media URL as a message
        onSendMessage({ url: downloadURL, type });
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Failed to select media.');
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleEmoticonPress}>
        <Icon name="insert-emoticon" size={30} color="gray" style={styles.icon} />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Mesaj"
        value={message}
        onChangeText={handleTextChange}
      />
      <TouchableOpacity onPress={handleMediaSelect}>
        <Icon name="photo-camera" size={30} color="gray" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSendPress} disabled={message.length === 0}>
        <Icon
          name={message.length > 0 ? "send" : "mic"}
          size={30}
          color={message.length > 0 ? "#00ae59" : "gray"}
          style={styles.icon}
        />
      </TouchableOpacity>
      {showEmojiKeyboard && (
        <EmojiKeyboard
          onEmojiSelected={handleEmojiSelect}
          onBackspace={() => {}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  icon: {
    marginHorizontal: width * 0.02,
  },
  input: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    fontSize: 16,
  },
});

export default MessageInput;
