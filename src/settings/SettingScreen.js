import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "../hooks/useDisableBackButton";
import LogoutButton from "../components/LogoutButton";
import LoadingOverlay from "../components/LoadingOverlay";
import ProfileIconWithCamera from "../components/ProfileIconWithCamera";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function SettingScreen() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: '', about: '', avatar: '' });
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const navigation = useNavigation();
  useDisableBackButton();

  useEffect(() => {
    if (user) {
      setLoading(true);
      const fetchUserData = async () => {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [user]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access the media library is required.');
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

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Check for username uniqueness
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', userData.username.trim())
        .get();

      if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== user.uid) {
        Alert.alert('Error', 'This username is already taken. Please choose another one.');
        setLoading(false);
        return;
      }

      // Proceed with the update if username is unique
      await firestore().collection('users').doc(user.uid).update({
        username: userData.username.trim(),
        about: userData.about.trim(),
        avatar: userData.avatar,
      });
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
      setIsChanged(false);
    } catch (error) {
      Alert.alert('Error', 'There was an error updating your profile. Please try again.');
    }
    setLoading(false);
  };

  if (!userData) {
    return <LoadingOverlay visible={loading} />;
  }

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setIsChanged(true);
  };

  const menuItems = [
    { icon: 'key-outline', label: 'Hesap', subLabel: 'Güvenlik bildirimleri, numara değiştirme' },
    { icon: 'lock-closed-outline', label: 'Gizlilik', subLabel: 'Kişileri engelleme, süreli mesajlar' },
    { icon: 'person-circle-outline', label: 'Avatar', subLabel: 'Oluşturma, düzenleme, profil fotoğrafı' },
    { icon: 'heart-outline', label: 'Favoriler', subLabel: 'Ekle, yeniden sırala, çıkar' },
    { icon: 'chatbubble-outline', label: 'Sohbetler', subLabel: 'Tema, duvar kağıtları, sohbet geçmişi' },
    { icon: 'notifications-outline', label: 'Bildirimler', subLabel: 'Mesaj, grup ve arama sesleri' },
    { icon: 'people-outline', label: 'Arkadaş davet et', subLabel: 'Arkadaşlarını davet et' },
    { icon: 'globe-outline', label: 'Uygulama dili', subLabel: 'Türkçe (cihaz dili)' },
    { icon: 'help-circle-outline', label: 'Yardım', subLabel: 'Destek alın, geri bildirim gönderin' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        {isChanged && (
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        )}
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Icon name={item.icon} size={24} color="#4CAF50" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSubLabel}>{item.subLabel}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <LogoutButton />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameInput: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    flex: 1,
  },
  editIcon: {
    marginLeft: 10,
  },
  aboutInput: {
    fontSize: 14,
    color: '#666',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 0,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuTextContainer: {
    marginLeft: 20,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuSubLabel: {
    fontSize: 12,
    color: '#888',
  },
});
