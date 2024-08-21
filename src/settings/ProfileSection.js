import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import ProfileIconWithCamera from "../components/ProfileIconWithCamera";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const ProfileSection = ({ userData, setUserData, setIsChanged, showAlert, isChanged }) => {
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permission Denied', 'Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, avatar: result.assets[0].uri });
      setIsChanged(true);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'username' && value.length > 16) {
      return; // Limit the length of username to 16 characters
    }
    setUserData({ ...userData, [field]: value });
    setIsChanged(true);
  };

  return (
    <View style={styles.profileContainer}>
      <ProfileIconWithCamera
        avatarUri={userData.avatar}
        onCameraPress={handleImagePicker}
        avatarSize={100}
      />
      <View style={styles.userInfo}>
        <View style={styles.usernameContainer}>
          <TextInput
            style={styles.usernameInput}
            value={userData.username}
            onChangeText={(text) => handleInputChange('username', text)}
            placeholder="Username"
            maxLength={16}  // Limit the input length to 16 characters
          />
          <Icon name="pencil-outline" size={20} color="#888" style={styles.editIcon} />
        </View>
        <TextInput
          style={styles.aboutInput}
          value={userData.about}
          onChangeText={(text) => handleInputChange('about', text)}
          placeholder="About"
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  userInfo: {
    marginLeft: 20,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameInput: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editIcon: {
    marginLeft: 10,
  },
  aboutInput: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default ProfileSection;
