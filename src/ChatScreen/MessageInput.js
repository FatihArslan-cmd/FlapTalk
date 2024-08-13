import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Platform, Pressable, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EmojiKeyboard from 'rn-emoji-keyboard';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import storage from '@react-native-firebase/storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackInstance, setPlaybackInstance] = useState(null);
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

  const handleEmoticonPress = () => {
    setShowEmojiKeyboard(!showEmojiKeyboard);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prevMessage) => prevMessage + emoji);
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
        const { uri, type } = result.assets[0] || {};
        if (!uri) {
          Alert.alert('Error', 'Failed to select media.');
          return;
        }

        const fileName = uri.split('/').pop();
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

        const path = `media/${Date.now()}_${fileName}`;
        const reference = storage().ref(path);
        await reference.putFile(uploadUri);

        const downloadURL = await reference.getDownloadURL();

        onSendMessage({ url: downloadURL, type });
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      Alert.alert('Error', 'Failed to select media.');
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

      const path = `audio/${Date.now()}_${fileName}`;
      const reference = storage().ref(path);
      await reference.putFile(uploadUri);

      const downloadURL = await reference.getDownloadURL();

      onSendMessage({ url: downloadURL, type: 'audio' });
    } catch (error) {
      console.error('Failed to send audio:', error);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleEmoticonPress}>
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
            placeholder="Mesaj"
            value={message}
            onChangeText={handleTextChange}
          />
          {message.length === 0 ? (
            <>
              <TouchableOpacity onPress={handleMediaSelect}>
                <Ionicons name="document-outline" size={28} color="gray" style={styles.icon} />
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
                <Icon name="mic" size={30} color="#fff" />
                {recording && (
                  <Text style={styles.recordingText}>{recordingDuration}s</Text>
                )}
              </Pressable>
            </>
          ) : (
            <TouchableOpacity onPress={handleSendPress} disabled={message.length === 0 && !audioUri}>
              <Icon name={"send"} size={30} color={"#00ae59"} style={styles.icon} />
            </TouchableOpacity>
          )}
          {showEmojiKeyboard && (
            <EmojiKeyboard
              onEmojiSelected={handleEmojiSelect}
              onBackspace={() => {}}
            />
          )}
        </>
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
});

export default MessageInput;
