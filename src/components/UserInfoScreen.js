import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getCurrentDate } from '../utils/date';
import AlertComponent from './AlertComponent';
import LoadingOverlay from './LoadingOverlay';
import CustomText from './CustomText';
import Header from '../phoneLoginScreen/Header';
import AvatarChoose from './AvatarChoose';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClearButton from './renderClearButton';
import Button from './Button';
import useAlert from '../hooks/useAlert';

const { width, height } = Dimensions.get('window');

const UserInfoScreen = ({ route }) => {
  const { uid, loginMethod } = route.params;
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [avatar, setAvatar] = useState('');

  const navigation = useNavigation();
  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert();

  useEffect(() => {
    return () => {
      const clearSession = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('uid');
      };
      clearSession();
    };
  }, []);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setAbout(userData.about || '');
        setDate(userData.date || '');
        setAvatar(userData.avatar || ''); // Set the avatar state
      }
    };

    fetchUserInfo();
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      const storeLoginMethod = async () => {
        await AsyncStorage.setItem('loginMethod', loginMethod);
      };
      storeLoginMethod();
    }, [loginMethod])
  );

  const handleSave = async () => {
    if (!username.trim()) {
      showAlert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }
  
    setLoading(true);
  
    try {
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', username.trim())
        .get();
  
      if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== uid) {
        showAlert('Hata', 'Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.');
        setLoading(false);
        return;
      }
  
      const currentDate = date || getCurrentDate();
      const aboutText = about.trim() || 'Hey dear, I am new in FlapTalk'; // Default text if 'about' is empty
  
      await firestore().collection('users').doc(uid).set({
        username: username.trim(),
        about: aboutText,
        date: currentDate,
        avatar: avatar ? (avatar.uri || avatar) : null, // Use defaultAvatar if avatar is not selected
      });
  
      await AsyncStorage.setItem('userToken', 'logged_in');
  
      navigation.navigate('MainApp', { uid: uid });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
  };

  return (
    <View style={styles.container}>
      <Header fontSize={width * 0.07} color='#00ad59' fontFamily='pop' text="Profil Bilgisi"/>
      <CustomText fontFamily="loti" style={styles.subtitle}>
        Lütfen adınızı girin ve isteğe bağlı olarak profil fotoğrafınızı ekleyin.
      </CustomText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={(text) => setUsername(text.slice(0, 16))} 
        />
        <ClearButton value={username} setValue={(text) => setUsername(text.slice(0, 16))} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Hakkında"
          value={about}
          onChangeText={setAbout}
        />
        <ClearButton value={about} setValue={setAbout} />
      </View>
      <AvatarChoose initialAvatar={avatar} onAvatarSelect={handleAvatarSelect} />
      <Button onPress={handleSave} text={'Kaydet'}/>
      <AlertComponent
        visible={isVisible}
        onClose={hideAlert}
        title={title}
        message={message}
        onConfirm={confirmAlert}
        confirmText="Tamam"
      />
      <LoadingOverlay visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.1,
    backgroundColor:'#FAF9F6'
  },
  subtitle: {
    fontSize: height * 0.025,
    color: '#555',
    textAlign: 'center',
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    width: width * 0.8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: width * 0.03,
  },
  input: {
    flex: 1,
    height: height * 0.05,
  },
});

export default UserInfoScreen;
