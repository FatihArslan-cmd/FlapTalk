import React, { useState, useEffect, useContext, useMemo,useRef } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, TextInput, Share, Modal } from "react-native";
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
import { debounce } from 'lodash';
import AlertComponent from '../components/AlertComponent';
import useAlert from '../hooks/useAlert';
import { Barcode } from 'expo-barcode-generator';
import LanguageSelector from "./LanguageSelectionModal";
const { width } = Dimensions.get('window');

export default function SettingScreen() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState({ username: '', about: '', avatar: '' });
  const [isChanged, setIsChanged] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [barcodeVisible, setBarcodeVisible] = useState(false);  // State to control barcode modal visibility
  const navigation = useNavigation();
  const languageSelectorRef = useRef();

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
      showAlert('Error', 'Username cannot be empty.');
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
      return; // Limit the length of username to 16 characters
    }
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
        url: 'https://your-app-url.com',
      });
    } catch (error) {
      showAlert('Error', 'There was an error sharing the app.');
    }
  };

  const handleInviteFriend = () => {
    setBarcodeVisible(true);  // Show the barcode modal when "Arkadaş davet et" is pressed
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
    { icon: 'share-outline', label: 'Uygulamayı Paylaş', subLabel: 'Arkadaşlarınla paylaş' },
  ];

  const filteredMenuItems = useMemo(() => menuItems.filter(item =>
    item.label.toLowerCase().includes(searchText) || item.subLabel.toLowerCase().includes(searchText)
  ), [searchText]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.label === 'Arkadaş davet et') {
          handleInviteFriend();
        } else if (item.label === 'Uygulamayı Paylaş') {
          handleShare();
        }else if (item.label === 'Uygulama dili') {
          languageSelectorRef.current.openModal();
        }else if (item.label === 'Yardım') {
          navigation.navigate('HelpScreen');
        }else if (item.label === 'Sohbetler') {
          navigation.navigate('ChatSettingScreen');
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
                    placeholder="Username "
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
            {isChanged && (
              <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                <Text style={styles.updateButtonText}>Update Profile</Text>
              </TouchableOpacity>
            )}
          </>
        }
        ListFooterComponent={<LogoutButton />}
      />
      {/* Barcode Modal */}
      <Modal
        visible={barcodeVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBarcodeVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Arkadaşına Davet Et</Text>
            <Barcode
              value={userData.username}
              options={{
                format: 'CODE128',
                background: '#fff',
                lineColor: '#000',
              }}
              width={2}
              height={100}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setBarcodeVisible(false)}
            >
              <Text style={styles.closeButtonText}>Kapat</Text>
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
        confirmText="OK"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FAF9F6'
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
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
  updateButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuTextContainer: {
    marginLeft: 15,
  },
  menuLabel: {
    fontSize: 16,
  },
  menuSubLabel: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
