import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClearButton from '../components/renderClearButton';
import CustomText from '../components/CustomText';
import LoadingOverlay from '../components/LoadingOverlay';
import useAlert from '../hooks/useAlert'; // Import your custom hook

const { width } = Dimensions.get('window');

const EmailLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert(); // Use the custom hook
  
  const handleForgotPassword = async () => {
    if (!email) {
      showAlert('Validation Error', 'Please enter your email address.');
      return;
    }

    try {
      await firebase.auth().sendPasswordResetEmail(email);
      showAlert('Success', 'Password reset email sent.');
    } catch (error) {
      showAlert('Error', 'Failed to send password reset email. Please try again.');
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
      showAlert('Validation Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        showAlert('Email Not Verified', 'Please verify your email before logging in.');
        return;
      }

      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }

      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid, loginMethod: 'email' });
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with that email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      }
      showAlert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animatable.View style={styles.container} animation="fadeInDownBig" duration={600}>
      <CustomText fontFamily={'pop'} style={styles.title}>Log In</CustomText>
      <View style={styles.inputWrapper}>
        <Icon name="email" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <ClearButton value={email} setValue={setEmail} />
      </View>
      <View style={styles.inputWrapper}>
        <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconWrapper}>
          <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#888" />
        </TouchableOpacity>
        <ClearButton value={password} setValue={setPassword} />
      </View>
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
          <Icon name={rememberMe ? 'check-box' : 'check-box-outline-blank'} size={24} color="#888" />
        </TouchableOpacity>
        <CustomText fontFamily={'pop'} style={styles.rememberMeText}>Remember me</CustomText>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Icon name="login" size={20} color="#fff" style={styles.buttonIcon} />
        <CustomText fontFamily={'pop'} style={styles.buttonText}>Log In</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
        <Icon name="help-outline" size={20} color="#005657" style={styles.forgotPasswordIcon} />
        <CustomText fontFamily={'pop'} style={styles.forgotPasswordText}>Forgot Password?</CustomText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EmailSignup')} style={styles.linkWrapper}>
        <Icon name="person-add" size={20} color="#005657" style={styles.linkIcon} />
        <CustomText fontFamily={'pop'} style={styles.link}>Don't have an account? Sign Up</CustomText>
      </TouchableOpacity>
      {isVisible && (
        <AlertComponent
          visible={isVisible}
          onClose={hideAlert}
          title={title}
          message={message}
          onConfirm={confirmAlert}
          confirmText="OK"
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
    backgroundColor: '#fff',
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.08,
    marginBottom: 20,
    color: '#005657',
  },
  inputWrapper: {
    width: width * 0.9,
    height: 50,
    borderColor: '#ccc',
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
    backgroundColor: '#00ae59',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  linkIcon: {
    marginRight: 5,
  },
  link: {
    color: '#005657',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 5,
    color: '#888',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordIcon: {
    marginRight: 5,
  },
  forgotPasswordText: {
    color: '#005657',
  },
});

export default EmailLoginScreen;
