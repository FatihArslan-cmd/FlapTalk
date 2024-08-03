import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Button = ({ onPress, text, margin = 0 }) => {
  return (
    <TouchableOpacity style={[styles.button, { margin }]} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#075E54',
    paddingVertical: height * 0.02,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
});

export default Button;
