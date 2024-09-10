import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bounce } from 'react-native-animated-spinkit';
import CustomText from './CustomText';

const { width, height } = Dimensions.get('window');

const AuthButton = ({ style, iconName, text, onPress, showBounce, bounceColor, disabled }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled}>
    <Icon name={iconName} size={width * 0.05} color={bounceColor || '#e6e6e6'} style={styles.icon} />
    <CustomText fontFamily="pop">
      <Text style={[styles.buttonText, bounceColor && { color: bounceColor }]}>{text}</Text>
    </CustomText>
    {showBounce && <Bounce marginLeft={width *0.02} size={width * 0.06} color={bounceColor || 'white'} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0d0d0d',
    borderRadius: width * 0.075, // Adjust border radius based on screen width
    paddingVertical: height * 0.012, // Adjust padding based on screen height
    marginVertical: height * 0.006, // Adjust margin based on screen height
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#e6e6e6',
    fontSize: width * 0.045, // Adjust font size based on screen width
    marginLeft: width * 0.025, // Adjust margin based on screen width
  },
  icon: {
    marginRight: width * 0.025, // Adjust margin based on screen width
  },
});

export default AuthButton;
