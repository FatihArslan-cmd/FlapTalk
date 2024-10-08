import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import CustomText from './CustomText';

const { width } = Dimensions.get('window');

const Button = ({ onPress, text, margin = 0,marginTop=0, fontFamily = 'pop' }) => {
  return (
    <TouchableOpacity style={[styles.button, { margin,marginTop }]} onPress={onPress}>
      <CustomText style={styles.buttonText} fontFamily={fontFamily}>
        {text}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00ae59',
    paddingVertical: 10, // Fixed padding value for better consistency
    paddingHorizontal: width * 0.1,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
});

export default Button;
