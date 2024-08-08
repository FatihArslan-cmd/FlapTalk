import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

const ChatRoomHeader = ({ user }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      {user && (
        <>
          <Image source={{ uri: user.avatar || defaultAvatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
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
  backText: {
    color: '#007AFF',
    fontSize: 18,
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
  },
});

export default ChatRoomHeader;
