import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClearButton from '../components/renderClearButton';
import CustomText from '../components/CustomText';
import LoadingOverlay from '../components/LoadingOverlay';
import useAlert from '../hooks/useAlert';
import AlertComponent from '../components/AlertComponent';
import useNavigationBarSync from '../hooks/useNavigationBarSync';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const { width } = Dimensions.get('window');

const EmailSignupScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert();
  const { isDarkMode } = useContext(ThemeContext); // Access theme context
  const backgroundColor = isDarkMode ? '#121212' : '#FAF9F6';
  useNavigationBarSync(backgroundColor);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      showAlert(t('Validation Error'), t('Please fill in all fields.'));
      return;
    }

    if (password !== confirmPassword) {
      showAlert(t('Validation Error'), t('Passwords do not match.'));
      return;
    }

    setLoading(true);
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
        email: email,
      });

      userCredential.user.sendEmailVerification();
      showAlert(t('Sign Up Success'), t('Please verify your email address.'));
      navigation.navigate('EmailLogin');
    } catch (error) {
      let errorMessage = t('Something went wrong. Please try again.');
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('That email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('That email address is invalid.');
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('Password should be at least 6 characters.');
      }
      showAlert(t('Sign Up Error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View style={[styles.container, { backgroundColor }]} animation="fadeInDownBig" duration={600}>
      <CustomText fontFamily={'pop'} style={[styles.title, { color: isDarkMode ? '#fff' : '#005657' }]}>{t('Sign Up')}</CustomText>
      <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#ccc' }]}>
        <Icon name="email" size={20} color={isDarkMode ? '#aaa' : '#888'} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder={t('Email')}
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <ClearButton value={email} setValue={setEmail} />
      </View>
      <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#ccc' }]}>
        <Icon name="lock" size={20} color={isDarkMode ? '#aaa' : '#888'} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder={t('Password')}
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconWrapper}>
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={isDarkMode ? '#aaa' : '#888'} />
        </TouchableOpacity>
        <ClearButton value={password} setValue={setPassword} />
      </View>
      <View style={[styles.inputWrapper, { borderColor: isDarkMode ? '#333' : '#ccc' }]}>
        <Icon name="lock" size={20} color={isDarkMode ? '#aaa' : '#888'} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
          placeholder={t('Confirm Password')}
          placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
          secureTextEntry={!showPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <ClearButton value={confirmPassword} setValue={setConfirmPassword} />
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#005657' : '#00ae59' }]} onPress={handleSignUp}>
        <Icon name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
        <CustomText fontFamily={'pop'} style={styles.buttonText}>{t('Sign Up')}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EmailLogin')} style={styles.linkWrapper}>
        <Icon name="login" size={20} color={isDarkMode ? '#00ae59' : '#005657'} style={styles.linkIcon} />
        <CustomText fontFamily={'pop'} style={[styles.link, { color: isDarkMode ? '#00ae59' : '#005657' }]}>{t('Already have an account? Log In')}</CustomText>
      </TouchableOpacity>
      {isVisible && (
        <AlertComponent
          visible={isVisible}
          onClose={hideAlert}
          title={title}
          message={message}
          onConfirm={confirmAlert}
          confirmText={t('OK')}
        />
      )}
      <LoadingOverlay visible={loading} />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    marginBottom: 20,
  },
  inputWrapper: {
    width: width * 0.9,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  iconWrapper: {
    padding: 5,
  },
  button: {
    width: width * 0.9,
    height: 50,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  linkIcon: {
    marginRight: 10,
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default EmailSignupScreen;
