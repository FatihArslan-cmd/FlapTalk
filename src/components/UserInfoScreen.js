import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import AlertComponent from './AlertComponent';
import LoadingOverlay from './LoadingOverlay';
import CustomText from './CustomText';
import Header from '../phoneLoginScreen/Header';
const { width, height } = Dimensions.get('window');

const UserInfoScreen = ({ route }) => {
  const { uid } = route.params;
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUsername(userData.username || '');
        setAbout(userData.about || '');
      }
    };

    fetchUserInfo();
  }, [uid]);

  const handleSave = async () => {
    if (!username.trim() || !about.trim()) {
      setAlertTitle('Uyarı');
      setAlertMessage('Lütfen tüm alanları doldurun.');
      setAlertVisible(true);
      return;
    }

    setLoading(true); // Show loading overlay

    try {
      const usernameSnapshot = await firestore()
        .collection('users')
        .where('username', '==', username.trim())
        .get();

      if (!usernameSnapshot.empty && usernameSnapshot.docs[0].id !== uid) {
        setAlertTitle('Hata');
        setAlertMessage('Bu kullanıcı adı zaten alınmış. Lütfen başka bir kullanıcı adı seçin.');
        setAlertVisible(true);
        setLoading(false); // Hide loading overlay
        return;
      }

      await firestore().collection('users').doc(uid).set({
        username: username.trim(),
        about: about.trim(),
      });

      navigation.navigate('AppHomePage', { loginMethod: 'phone' });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Hide loading overlay
    }
  };

  return (
    <View style={styles.container}>
      <Header fontSize={width * 0.07}  color='#008000' fontFamily='pop' text="Profil Bilgisi"/>
      <CustomText fontFamily={"loti"} style={styles.subtitle}>
        Lütfen adınızı girin ve isteğe bağlı olarak profil fotoğrafınızı ekleyin.
      </CustomText>
      <View style={styles.avatarContainer}>
        <FontAwesome6 name='face-grin-wide' style={styles.avatar} size={height * 0.12} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Hakkında"
        value={about}
        onChangeText={setAbout}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
      <AlertComponent
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: height * 0.04,
    color: '#008000',
  },
  subtitle: {
    fontSize: height * 0.0250,
    color: '#555',
    textAlign: 'center',
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.08,
  },
  avatarContainer: {
    marginBottom: height * 0.02,
  },
  avatar: {
    color: '#555',
  },
  input: {
    width: width * 0.8,
    height: height * 0.05,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: width * 0.03,
    marginBottom: height * 0.02,
  },
  button: {
    backgroundColor: '#008000',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.1,
    borderRadius: 16,
    marginTop: 'auto',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: height * 0.02,
  },
});

export default UserInfoScreen;
