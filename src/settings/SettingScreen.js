import React, { useState, useEffect, useContext, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, TextInput, Share } from "react-native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "../hooks/useDisableBackButton";
import LogoutButton from "../components/LogoutButton";
import ProfileIconWithCamera from "../components/ProfileIconWithCamera";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import CustomText from "../components/CustomText";
import AppHeader from "../components/AppHeader";
import { debounce } from 'lodash';  // Import debounce from lodash
import AlertComponent from '../components/AlertComponent';  // Import your AlertComponent
import useAlert from '../hooks/useAlert';  // Import your custom hook

const { width } = Dimensions.get('window');

export default function SettingScreen() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: '', about: '', avatar: '' });
  const [isChanged, setIsChanged] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert();  // Use your custom hook
  useDisableBackButton();

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      };
      fetchUserData();
    }
  }, [user]);

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

  const handleUpdateProfile = async () => {
    try {
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', userData.username.trim())
        .get();

      if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== user.uid) {
        // Use custom alert
        showAlert('Error', 'This username is already taken. Please choose another one.');
        return;
      }

      await firestore().collection('users').doc(user.uid).update({
        username: userData.username.trim(),
        about: userData.about.trim(),
        avatar: userData.avatar,
      });
      // Use custom alert for success
      showAlert('Profile Updated', 'Your profile has been successfully updated.', () => {
        setIsChanged(false);
      });
    } catch (error) {
      // Use custom alert for error
      showAlert('Error', 'There was an error updating your profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    setIsChanged(true);
  };

  const debouncedSearch = useMemo(() => debounce(setSearchText, 300), []);

  const handleSearch = (text) => {
    debouncedSearch(text.toLowerCase());
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing app!`,
        url: 'https://your-app-url.com', // Replace with your app's URL
      });
    } catch (error) {
      showAlert('Error', 'There was an error sharing the app.');
    }
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
    // Add the Share menu item
    { icon: 'share-outline', label: 'Uygulamayı Paylaş', subLabel: 'Arkadaşlarınla paylaş' },
  ];

  const filteredMenuItems = useMemo(() => menuItems.filter(item =>
    item.label.toLowerCase().includes(searchText) || item.subLabel.toLowerCase().includes(searchText)
  ), [searchText]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.label === 'Uygulamayı Paylaş') {
          handleShare();
        } else {
          // Handle other menu items
        }
      }}
    >
      <Icon name={item.icon} size={28} color="#4CAF50" />
      <View style={styles.menuTextContainer}>
        <CustomText fontFamily={'pop'} style={styles.menuLabel}>{item.label}</CustomText>
        <CustomText fontFamily={'pop'} style={styles.menuSubLabel}>{item.subLabel}</CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title={'Settings'} onSearch={handleSearch} />
      <FlatList
        data={filteredMenuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
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
          </>
        }
        ListFooterComponent={<LogoutButton />}
      />
      {/* Use AlertComponent with custom hook */}
      <AlertComponent
        visible={isVisible}
        onClose={hideAlert}
        title={title}
        message={message}
        onConfirm={confirmAlert}
        confirmText="OK"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
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
    fontSize:  20,
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
    marginHorizontal: 20,
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
    paddingHorizontal: 20,
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