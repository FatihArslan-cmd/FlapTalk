import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');

const EmailSignupScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    // Basic validation
    if (!username || !email || !password) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

      const user = userCredential.user;

      await user.sendEmailVerification({
        url: 'https://flaptalk-3c1fc.firebaseapp.com',
      });

      await firebase.firestore().collection('users').doc(user.uid).set({
        email: email,
      });

      // Optionally update the user's profile with the username

      // Navigate to another screen or show success message
      navigation.navigate('Emaillogin');
    } catch (error) {
      // Handle authentication errors
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Signup Error', 'That email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Signup Error', 'That email address is invalid.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Signup Error', 'Password is too weak.');
      } else {
        console.log(error)
        Alert.alert('Signup Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('EmailLogin')}>
        <Text style={styles.link}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
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

export default EmailSignupScreen;
