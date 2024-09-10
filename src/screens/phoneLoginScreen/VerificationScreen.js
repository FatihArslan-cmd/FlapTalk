import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = () => {
  const navigation = useNavigation();

  const resendVerificationEmail = async () => {
    const user = auth().currentUser;
    if (user) {
      await user.sendEmailVerification();
      alert('Verification email resent. Please check your email.');
    }
  };

  const checkVerificationStatus = async () => {
    const user = auth().currentUser;
    await user.reload();
    if (user.emailVerified) {
      navigation.navigate('AppHomePage');
    } else {
      alert('Email not verified yet. Please check your email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please verify your email address to continue.</Text>
      <TouchableOpacity style={styles.button} onPress={resendVerificationEmail}>
        <Text style={styles.buttonText}>Resend Verification Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={checkVerificationStatus}>
        <Text style={styles.buttonText}>I have verified my email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#005657',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default VerificationScreen;
