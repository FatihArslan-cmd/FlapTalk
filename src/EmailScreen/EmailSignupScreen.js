import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ClearButton from '../components/renderClearButton';
import AlertComponent from '../components/AlertComponent';
import CustomText from '../components/CustomText';
import LoadingOverlay from '../components/LoadingOverlay';

const { width } = Dimensions.get('window');

const EmailSignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setAlertTitle('Validation Error');
      setAlertMessage('Please fill in all fields.');
      setAlertVisible(true);
      return;
    }

    if (password.length < 6) {
      setAlertTitle('Validation Error');
      setAlertMessage('Password must be at least 6 characters long.');
      setAlertVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setAlertTitle('Validation Error');
      setAlertMessage('Passwords do not match.');
      setAlertVisible(true);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      await user.sendEmailVerification({
        url: 'https://flaptalk-3c1fc.firebaseapp.com',
      });

      setAlertTitle('Verification Email Sent');
      setAlertMessage('Please check your email to verify your account.');
      setAlertVisible(true);

      const userDoc = firebase.firestore().collection('users').doc(user.uid);
      await userDoc.set({
        email: email,
        emailVerified: false,
      });

      // Schedule cleanup for unverified user
      setTimeout(async () => {
        const userSnapshot = await userDoc.get();
        if (userSnapshot.exists && !userSnapshot.data().emailVerified) {
          await user.delete();
          await userDoc.delete();
        }
      }, 1000000); // 24 hours in milliseconds

      const intervalId = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalId);
          await userDoc.update({ emailVerified: true });
          setAlertTitle('Email Verified');
          setAlertMessage('Your email has been verified.');
          setAlertVisible(true);
          navigation.navigate('EmailLogin');
        }
      }, 1000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setAlertTitle('Signup Error');
        setAlertMessage('That email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setAlertTitle('Signup Error');
        setAlertMessage('That email address is invalid.');
      } else if (error.code === 'auth/weak-password') {
        setAlertTitle('Signup Error');
        setAlertMessage('Password is too weak.');
      } else {
        setAlertTitle('Signup Error');
        setAlertMessage('Something went wrong. Please try again.');
      }
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
      <Animatable.View style={styles.container} animation="fadeInDownBig" duration={600}>
        <CustomText fontFamily={'pop'} style={styles.title}>Sign Up</CustomText>
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
        <View style={styles.inputWrapper}>
          <Icon name="lock" size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <ClearButton value={confirmPassword} setValue={setConfirmPassword} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Icon name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
          <CustomText fontFamily={'pop'} style={styles.buttonText}>Sign Up</CustomText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EmailLogin')} style={styles.linkWrapper}>
          <Icon name="login" size={20} color="#005657" style={styles.linkIcon} />
          <CustomText fontFamily={'pop'} style={styles.link}>Already have an account? Log In</CustomText>
        </TouchableOpacity>
        <AlertComponent
          visible={alertVisible}
          onClose={() => setAlertVisible(false)}
          title={alertTitle}
          message={alertMessage}
          onConfirm={() => setAlertVisible(false)}
          confirmText="OK"
        />
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
});

export default EmailSignupScreen;
