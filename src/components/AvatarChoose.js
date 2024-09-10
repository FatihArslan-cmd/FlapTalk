import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../src/components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileIconWithCamera from './ProfileIconWithCamera';

const { width } = Dimensions.get('window');

const AvatarChoose = ({ onAvatarSelect }) => {
  
  const pickImageFromGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = { uri: result.assets[0].uri };
        onAvatarSelect(selectedImage);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileIconWithCamera 
        onCameraPress={pickImageFromGallery}
        avatarSize={120}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});

export default AvatarChoose;
