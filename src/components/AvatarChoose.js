import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../src/components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileIconWithCamera from './ProfileIconWithCamera';
import FastImage from 'react-native-fast-image';
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
  { id: 'gallery', type: 'button' } // Özel buton için eklenen öğe
];

const AvatarChoose = ({ onAvatarSelect, initialAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const selectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
    setModalVisible(false);
    onAvatarSelect(avatar);
  };

  const cancelSelection = () => {
    setSelectedAvatar(initialAvatar);
    setModalVisible(false);
    onAvatarSelect(initialAvatar);
  };

  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImage = { uri: result.assets[0].uri };
      setSelectedAvatar(selectedImage);
      setModalVisible(false);
      onAvatarSelect(selectedImage);
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === 'button') {
      return (
        <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
          <MaterialIcons name={'perm-media'} size={width * 0.20} />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={() => selectAvatar(item)}>
        <FastImage source={item} style={styles.avatar}  resizeMode={FastImage.resizeMode.cover}/>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ProfileIconWithCamera 
        avatarUri={selectedAvatar.uri} 
        onCameraPress={openModal}
        avatarSize={120}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={avatars}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderItem}
          />
          <Button text={'İptal'} onPress={cancelSelection} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 10,
  },
  galleryButton: {
    width: width * 0.30,
    height: width * 0.30,
    margin: width * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default AvatarChoose;
