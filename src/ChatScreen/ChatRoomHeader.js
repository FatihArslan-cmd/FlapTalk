import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

const ChatRoomHeader = ({ user, chatId }) => {
  const [userStatus, setUserStatus] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (user?.id) {
      const unsubscribe = firestore()
        .collection('users')
        .doc(user.id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            setUserStatus(doc.data().state);
          }
        });
    
      return () => unsubscribe();
    }
  }, [user]);

  const startVideoCall = () => {
    navigation.navigate('VideoCallScreen', { chatId, userId: user.id, isCaller: true });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={28} color="black" style={styles.backText} />
      </TouchableOpacity>

      {user && (
        <>
          <Image source={{ uri: user.avatar || defaultAvatar }} style={styles.avatar} />
          <Text style={styles.username}>
            {user.username}  
            {userStatus === 'online' && <Text style={styles.onlineStatus}> (Online) </Text>}
          </Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={startVideoCall}>
              <Octicons name="device-camera-video" size={28} color="black" style={styles.inputIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="call" size={28} color="black" style={styles.inputIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleDropdown}>
              <MaterialCommunityIcons name="dots-vertical" size={28} color="black" style={styles.inputIcon} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.dropdownItem}>
            <Octicons name="device-camera" size={24} color="black" />
            <Text style={styles.dropdownText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <MaterialCommunityIcons name="map-marker" size={24} color="black" />
            <Text style={styles.dropdownText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownItem}>
            <MaterialCommunityIcons name="contacts" size={24} color="black" />
            <Text style={styles.dropdownText}>Contact</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 25,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    zIndex: 10, // Ensures header is above other components
  },
  inputIcon: {
    margin: width * 0.02,
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
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
  },
  onlineStatus: {
    color: 'green',
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 60, // Adjust this based on your header height
    right: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 20, // Ensures dropdown is above other components
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ChatRoomHeader;
