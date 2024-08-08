import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const { width } = Dimensions.get('window'); // Get screen dimensions

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

const ChatRoomHeader = ({ user }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="black" style={styles.backText} />
      </TouchableOpacity>

      {user && (
        <>
          <Image source={{ uri: user.avatar || defaultAvatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <View style={styles.iconContainer}>
            <Octicons name="device-camera-video" size={28} color="black" style={styles.inputIcon} />
            <TouchableOpacity>
              <Icon name="call" size={28} color="black" style={styles.inputIcon} />
            </TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={28} color="black" style={styles.inputIcon} />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputIcon: {
    margin: width * 0.02, // Adjust margin based on screen width
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  backText: {
    color: '#007AFF',
    marginRight: 10,
  },
  avatar: {
    width: width * 0.1, // Adjust avatar size based on screen width
    height: width * 0.1, // Adjust avatar size based on screen width
    borderRadius: width * 0.05, // Half of avatar width/height for a circle
    marginRight: 10,
  },
  username: {
    fontSize: 18,
  },
});

export default ChatRoomHeader;
