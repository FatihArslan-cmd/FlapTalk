import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Share, Modal, TouchableOpacity } from "react-native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "../../hooks/useDisableBackButton";
import LogoutButton from "../../components/LogoutButton";
import ProfileIconWithCamera from "../../components/ProfileIconWithCamera";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import CustomText from "../../components/CustomText";
import AppHeader from "../../components/AppHeader";
import { debounce } from 'lodash';
import AlertComponent from "../../components/AlertComponent";
import useAlert from "../../hooks/useAlert";
import { Barcode } from 'expo-barcode-generator';
import LanguageSelector from "./LanguageSelectionModal";
import { useTranslation } from "react-i18next";

export default function SettingScreen() {
  const { user } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for theme
  const [userData, setUserData] = useState({ username: '', about: '', avatar: '' });
  const [isChanged, setIsChanged] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const navigation = useNavigation();
  const languageSelectorRef = useRef();
  const { t } = useTranslation();

  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert();
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
    if (!userData.username.trim()) {
      showAlert(t('Error'), t('Username cannot be empty.'));
      return;
    }

    try {
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', userData.username.trim())
        .get();

      if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== user.uid) {
        showAlert('Error', 'This username is already taken. Please choose another one.');
        return;
      }

      await firestore().collection('users').doc(user.uid).update({
        username: userData.username.trim(),
        about: userData.about.trim(),
        avatar: userData.avatar,
      });
      showAlert('Profile Updated', 'Your profile has been successfully updated.', () => {
        setIsChanged(false);
      });
    } catch (error) {
      showAlert('Error', 'There was an error updating your profile. Please try again.');
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'username' && value.length > 16) {
      return;
    }
    setUserData({ ...userData, [field]: value });
    setIsChanged(true);
  };

  const debouncedSearch = debounce(setSearchText, 300);

  const handleSearch = (text) => {
    debouncedSearch(text.toLowerCase());
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing app!`,
        url: 'https://your-app-url.com',
      });
    } catch (error) {
      showAlert('Error', 'There was an error sharing the app.');
    }
  };

  const handleInviteFriend = () => {
    setBarcodeVisible(true);
  };

  const dynamicMenuItems = [
    { icon: 'key-outline', label: t('account'), subLabel: t('account_sub_label'), action: () => navigation.navigate('AccountScreen') },
    { icon: 'heart-outline', label: t('favorites'), subLabel: t('favorites_sub_label'), action: () => navigation.navigate('FavoritesScreen') },
    { icon: 'chatbubble-outline', label: t('Chats'), subLabel: t('chats_sub_label'), action: () => navigation.navigate('ChatSettingScreen') },
    { icon: 'people-outline', label: t('invite_friends'), subLabel: t('invite_friends_sub_label'), action: handleInviteFriend },
    { icon: 'globe-outline', label: t('app_language'), subLabel: 'Türkçe (cihaz dili)', action: () => languageSelectorRef.current.openModal() },
    { icon: 'help-circle-outline', label: t('help_title'), subLabel: t('help_sub_label'), action: () => navigation.navigate('HelpScreen') },
    { icon: 'share-outline', label: t('share_app'), subLabel: t('share_app_sub_label'), action: handleShare },
  ].filter(item => item.label.toLowerCase().includes(searchText) || item.subLabel.toLowerCase().includes(searchText));

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: isDarkMode ? '#333' : '#ddd' }]}
      onPress={item.action}
    >
      <Icon name={item.icon} size={28} color={isDarkMode ? 'white' : '#4CAF50'} />
      <View style={styles.menuTextContainer}>
        <CustomText fontFamily={'pop'} style={[styles.menuLabel, { color: isDarkMode ? 'white' : 'black' }]}>{item.label}</CustomText>
        <CustomText fontFamily={'pop'} style={[styles.menuSubLabel, { color: isDarkMode ? '#E0E0E0' : '#888' }]}>{item.subLabel}</CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <AppHeader title={t('Settings')} onSearch={handleSearch} />
      <FlatList
        data={dynamicMenuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <View style={[styles.profileContainer, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
              <ProfileIconWithCamera
                avatarUri={userData.avatar}
                onCameraPress={handleImagePicker}
                avatarSize={100}
              />
              <View style={styles.userInfo}>
                <View style={styles.usernameContainer}>
                  <TextInput
                    style={[styles.usernameInput, { color: isDarkMode ? 'white' : 'black' }]}
                    value={userData.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                    placeholder="Username"
                    placeholderTextColor={isDarkMode ? '#888' : '#CCC'}
                    maxLength={16}
                  />
                  <Icon name="pencil-outline" size={20} color={isDarkMode ? 'white' : '#888'} style={styles.editIcon} />
                </View>
                <TextInput
                  style={[styles.aboutInput, { color: isDarkMode ? '#E0E0E0' : '#888' }]}
                  value={userData.about}
                  onChangeText={(text) => handleInputChange('about', text)}
                  placeholder={t('About')}
                  placeholderTextColor={isDarkMode ? '#888' : '#CCC'}
                  multiline
                />
              </View>
            </View>
            {isChanged && (
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                <Text style={styles.updateButtonText}>{t('update_profile_button')}</Text>
              </TouchableOpacity>
            )}
          </>
        }
        ListFooterComponent={<LogoutButton />}
      />
      <Modal
        visible={barcodeVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBarcodeVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? 'white' : 'black' }]}>{t('invite_friends')}</Text>
            <Barcode
              value={userData.username}
              options={{
                format: 'CODE128',
                background: isDarkMode ? '#333' : '#fff',
                lineColor: isDarkMode ? '#E0E0E0' : '#000',
              }}
              width={2}
              height={100}
            />
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: isDarkMode ? '#4CAF50' : '#4CAF50' }]}
              onPress={() => setBarcodeVisible(false)}
            >
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <LanguageSelector ref={languageSelectorRef} />
      <AlertComponent
        visible={isVisible}
        onClose={hideAlert}
        onConfirm={confirmAlert}
        title={title}
        message={message}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  aboutInput: {
    fontSize: 14,
    flex: 1,
  },
  editIcon: {
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 16,
    alignSelf: 'center',
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuTextContainer: {
    marginLeft: 16,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuSubLabel: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
  },
});