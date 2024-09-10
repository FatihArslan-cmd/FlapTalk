import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import ClearButton from '../../components/renderClearButton';
import CustomText from '../../components/CustomText';
import LoadingOverlay from '../../components/LoadingOverlay';
import useAlert from '../../hooks/useAlert';
import AlertComponent from '../../components/AlertComponent';
import useNavigationBarSync from '../../hooks/useNavigationBarSync';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const { width } = Dimensions.get('window');

const EmailLoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert();
  const { isDarkMode } = useContext(ThemeContext); // Access the theme mode

  const backgroundColor = isDarkMode ? '#121212' : '#FAF9F6';
  useNavigationBarSync(backgroundColor);

  const handleForgotPassword = async () => {
    if (!email) {
      showAlert(t('Validation Error'), t('Please enter your email address.'));
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      showAlert(t('Success'), t('Password reset email sent.'));
    } catch (error) {
      showAlert(t('Error'), t('Failed to send password reset email. Please try again.'));
    }
  };

  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('rememberedEmail');
        if (storedEmail) {
          setEmail(storedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered email:', error);
      }
    };
    loadRememberedEmail();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert(t('Validation Error'), t('Please fill in all fields.'));
      return;
    }

    setLoading(true);
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showAlert(t('Email Not Verified'), t('Please verify your email before logging in.'));
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }

      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid, loginMethod: 'email' });
    } catch (error) {
      let errorMessage = t('Something went wrong. Please try again.');
      if (error.code === 'auth/invalid-email') {
        errorMessage = t('That email address is invalid.');
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = t('No user found with that email address.');
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = t('Incorrect password.');
      }
      showAlert(t('Login Error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View style={[styles.container, { backgroundColor }]} animation="fadeInDownBig" duration={600}>
      <CustomText fontFamily={'pop'} style={[styles.title, { color: isDarkMode ? '#fff' : '#005657' }]}>{t('Log In')}</CustomText>
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
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Icon name={rememberMe ? 'check-box' : 'check-box-outline-blank'} size={24} color={isDarkMode ? '#aaa' : '#888'} />
        </TouchableOpacity>
        <CustomText fontFamily={'pop'} style={[styles.rememberMeText, { color: isDarkMode ? '#aaa' : '#888' }]}>{t('Remember me')}</CustomText>
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: isDarkMode ? '#005657' : '#00ae59' }]} onPress={handleLogin}>
        <Icon name="login" size={20} color="#fff" style={styles.buttonIcon} />
        <CustomText fontFamily={'pop'} style={styles.buttonText}>{t('Log In')}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Icon name="help-outline" size={20} color={isDarkMode ? '#00ae59' : '#005657'} style={styles.forgotPasswordIcon} />
        <CustomText fontFamily={'pop'} style={[styles.forgotPasswordText, { color: isDarkMode ? '#00ae59' : '#005657' }]}>{t('Forgot Password?')}</CustomText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EmailSignup')} style={styles.linkWrapper}>
        <Icon name="person-add" size={20} color={isDarkMode ? '#00ae59' : '#005657'} style={styles.linkIcon} />
        <CustomText fontFamily={'pop'} style={[styles.link, { color: isDarkMode ? '#00ae59' : '#005657' }]}>{t("Don't have an account? Sign Up")}</CustomText>
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
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 10,
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
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  forgotPasswordIcon: {
    marginRight: 10,
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
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

export default EmailLoginScreen;
