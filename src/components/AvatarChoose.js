import React, { useState } from 'react';
import { View, Image, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
import Button from './Button';

const { width, height } = Dimensions.get('window');

const avatars = [
  require('../../assets/avatars/3d-cartoon-style-character.jpg'),
  require('../../assets/avatars/Untitled (1).jpg'),
  require('../../assets/avatars/Untitled (10).jpg'),
  require('../../assets/avatars/Untitled (11).jpg'),
  require('../../assets/avatars/Untitled (12).jpg'),
  require('../../assets/avatars/Untitled (2).jpg'),
  require('../../assets/avatars/Untitled (3).jpg'),
  require('../../assets/avatars/Untitled (4).jpg'),
  require('../../assets/avatars/Untitled (5).jpg'),
  require('../../assets/avatars/Untitled (6).jpg'),
  require('../../assets/avatars/Untitled (8).jpg'),
  require('../../assets/avatars/Untitled (9).jpg'),
  require('../../assets/avatars/Untitled (13).jpg'),
  require('../../assets/avatars/Untitled (14).jpg'),
  require('../../assets/avatars/Untitled (15).jpg'),
  require('../../assets/avatars/Untitled (16).jpg'),
  require('../../assets/avatars/Untitled (17).jpg'),
  require('../../assets/avatars/Untitled (18).jpg'),
  require('../../assets/avatars/Untitled.jpg'),
];

const defaultAvatar = require('../../assets/avatars/defaultavatar.png'); // Default avatar

export default function AvatarChoose() {
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatar);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const selectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setModalVisible(false);
  };

  const cancelSelection = () => {
    setSelectedAvatar(defaultAvatar);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal}>
        <Image source={selectedAvatar} style={styles.icon} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={avatars}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => selectAvatar(item)}>
                <Image source={item} style={styles.avatar} />
              </TouchableOpacity>
            )}
          />
          <Button text={'Cancel'} onPress={cancelSelection}/>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    width: height * 0.12,
    height: height * 0.12,
    borderRadius: (height * 0.12) / 2,
    borderWidth: 2,
    borderColor: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: width * 0.30,
    height: width * 0.30,
    margin: width * 0.02,
    borderRadius:10
  },
});