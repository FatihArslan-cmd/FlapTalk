import React, { useState, useEffect, useCallback, useContext } from 'react';
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
import useNavigationBarSync from '../hooks/useNavigationBarSync';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const { width, height } = Dimensions.get('window');

const UserInfoScreen = ({ route }) => {
  const { uid, loginMethod } = route.params;
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState('');
  const [avatar, setAvatar] = useState('');
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for theme
  const backgroundColor = isDarkMode ? '#1c1c1c' : '#FAF9F6'; 
  useNavigationBarSync(backgroundColor); 
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
        setAvatar(userData.avatar || '');
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
      showAlert(t('Warning'), t('Please fill out all fields.'));
      return;
    }
  
    setLoading(true);
  
    try {
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', username.trim())
        .get();
  
      if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== uid) {
        showAlert(t('Error'), t('This username is already taken. Please choose another username.'));
        setLoading(false);
        return;
      }
  
      const currentDate = date || getCurrentDate();
      const aboutText = about.trim() || 'Hey dear, I am new in FlapTalk'; 
  
      await firestore().collection('users').doc(uid).set({
        username: username.trim(),
        about: aboutText,
        date: currentDate,
        avatar: avatar ? (avatar.uri || avatar) : null, 
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
    <View style={[styles.container, { backgroundColor }]}>
      <Header fontSize={width * 0.07} color={isDarkMode ? '#00ff87' : '#00ad59'} fontFamily='pop' text={t('Profile Information')} />
      <CustomText fontFamily="loti" style={[styles.subtitle, { color: isDarkMode ? '#ccc' : '#555' }]}>
        {t('Please enter your name and optionally add a profile photo.')}
      </CustomText>
      <View style={[styles.inputContainer, { borderColor: isDarkMode ? '#555' : '#ccc' }]}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder={t('Username')}
          placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
          value={username}
          onChangeText={(text) => setUsername(text.slice(0, 16))} 
        />
        <ClearButton value={username} setValue={(text) => setUsername(text.slice(0, 16))} />
      </View>
      <View style={[styles.inputContainer, { borderColor: isDarkMode ? '#555' : '#ccc' }]}>
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder={t('About')}
          placeholderTextColor={isDarkMode ? '#888' : '#ccc'}
          value={about}
          onChangeText={setAbout}
        />
        <ClearButton value={about} setValue={setAbout} />
      </View>
      <AvatarChoose initialAvatar={avatar} onAvatarSelect={handleAvatarSelect} />
      <Button onPress={handleSave} text={t('Save')} />
      <AlertComponent
        visible={isVisible}
        onClose={hideAlert}
        title={title}
        message={message}
        onConfirm={confirmAlert}
        confirmText={t('Okay')}
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
  },
  subtitle: {
    fontSize: height * 0.025,
    textAlign: 'center',
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    width: width * 0.8,
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
