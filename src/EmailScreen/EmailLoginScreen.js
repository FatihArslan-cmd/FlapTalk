import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const EmailLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // Navigate to another screen or show success message
      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid,loginMethod: 'phone' }); // Yönlendirme
    } catch (error) {
      // Handle authentication errors
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Login Error', 'No user found with that email.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Login Error', 'Incorrect password.');
      } else {
        Alert.alert('Login Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <SafeAreaWrapper>
      <Animatable.View
        style={styles.container}
        animation="fadeInDownBig"
        duration={600}
      >
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EmailSignup')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaWrapper>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: width * 0.9,
    height: 50,
    backgroundColor: '#005657',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#005657',
  },
});

export default EmailLoginScreen;
