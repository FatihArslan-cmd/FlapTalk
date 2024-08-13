import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform, Pressable, Text, Modal, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import storage from '@react-native-firebase/storage';
import EmojiSelector, { Categories } from 'react-native-emoji-selector';
import { Plane } from 'react-native-animated-spinkit'; // Import Plane spinner
import * as DocumentPicker from 'expo-document-picker';

const { width, height } = Dimensions.get('window');

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const recordingInterval = useRef(null);
  const playbackRef = useRef(null);

  const handleTextChange = (text) => {
    setMessage(text);
  };

  const handleSendPress = () => {
    if (audioUri) {
      handleSendAudio();
    } else {
      onSendMessage({ text: message });
    }
    setMessage('');
    setAudioUri(null);
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
        const { uri, type } = result.assets[0] || {};
        if (!uri) {
          Alert.alert('Error', 'Failed to select media.');
          return;
        }

        const fileName = uri.split('/').pop();
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        setLoading(true); // Start loading
        const path = `media/${Date.now()}_${fileName}`;
        const reference = storage().ref(path);
        await reference.putFile(uploadUri);

        const downloadURL = await reference.getDownloadURL();
        setLoading(false); // Stop loading

        onSendMessage({ url: downloadURL, type });
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      setLoading(false); // Stop loading on error
      Alert.alert('Error', 'Failed to select media.');
    }
  };
  const handleDocumentSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // You can specify document types, e.g., 'application/pdf' for PDF files
        copyToCacheDirectory: true,
      });
  
      if (result.type === 'success') {
        const { uri, name } = result;
  
        setLoading(true); // Start loading
        const path = `documents/${Date.now()}_${name}`;
        const reference = storage().ref(path);
        await reference.putFile(uri);
  
        const downloadURL = await reference.getDownloadURL();
        setLoading(false); // Stop loading
  
        onSendMessage({ url: downloadURL, type: 'document', name });
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      setLoading(false); // Stop loading on error
      Alert.alert('Error', 'Failed to select document.');
    }
  };
  const handleStartRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission denied', 'We need audio permissions to make this work!');
        return;
      }

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);

      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
        setRecordingDuration(0);
        clearInterval(recordingInterval.current);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handleSendAudio = async () => {
    if (!audioUri) return;

    try {
      const fileName = audioUri.split('/').pop();
      const uploadUri = Platform.OS === 'ios' ? audioUri.replace('file://', '') : audioUri;

      setLoading(true); // Start loading
      const path = `audio/${Date.now()}_${fileName}`;
      const reference = storage().ref(path);
      await reference.putFile(uploadUri);

      const downloadURL = await reference.getDownloadURL();
      setLoading(false); // Stop loading

      onSendMessage({ url: downloadURL, type: 'audio' });
    } catch (error) {
      console.error('Failed to send audio:', error);
      setLoading(false); // Stop loading on error
      Alert.alert('Error', 'Failed to send audio.');
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await playbackInstance.pauseAsync();
    } else {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      playbackRef.current = sound;
      setPlaybackInstance(sound);
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleCancelRecording = () => {
    setAudioUri(null);
    setRecordingDuration(0);
    if (playbackInstance) {
      playbackInstance.stopAsync();
      setPlaybackInstance(null);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!isEmojiPickerVisible);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {loading && (
        <>
          <Plane size={48} color="#00ae59" />
        </>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleEmojiPicker}>
          <Icon name="insert-emoticon" size={30} color="gray" style={styles.icon} />
        </TouchableOpacity>
        {audioUri ? (
          <View style={styles.playbackContainer}>
            <TouchableOpacity onPress={handlePlayPause} style={styles.playbackButton}>
              <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="#00ae59" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelRecording} style={styles.playbackButton}>
              <Icon name="cancel" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSendPress} style={styles.playbackButton}>
              <Icon name="send" size={30} color="#00ae59" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Message"
              value={message}
              onChangeText={handleTextChange}
            />
            {message.length === 0 ? (
              <>
                <TouchableOpacity onPress={handleDocumentSelect}>
  <Ionicons name="document-attach" size={28} color="gray" style={styles.icon} />
</TouchableOpacity>
                <TouchableOpacity onPress={handleMediaSelect}>
                  <Icon name="photo-camera" size={30} color="gray" style={styles.icon} />
                </TouchableOpacity>
                <Pressable
                  onPressIn={handleStartRecording}
                  onPressOut={handleStopRecording}
                  style={({ pressed }) => [
                    styles.micButton,
                    { backgroundColor: pressed || recording ? 'red' : 'gray' },
                  ]}
                >
                  <Icon name="mic" size={24} color="#fff" />
                
                </Pressable>
              </>
            ) : (
              <TouchableOpacity onPress={handleSendPress} disabled={message.length === 0 && !audioUri}>
                <Icon name="send" size={30} color="#00ae59" style={styles.icon} />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEmojiPickerVisible}
        onRequestClose={() => setEmojiPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <EmojiSelector
            onEmojiSelected={handleEmojiSelect}
            showSearchBar={false}
            showTabs={true}
            category={Categories.emotion}
            columns={8}
            style={styles.emojiSelector}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: width * 0.02,
  },
  input: {
    flex: 1,
    paddingHorizontal: width * 0.03,
    fontSize: 16,
  },
  micButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.02,
  },
  recordingText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  playbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playbackButton: {
    marginHorizontal: width * 0.05,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  emojiSelector: {
    height: height * 0.5,
  },
});

export default MessageInput;
