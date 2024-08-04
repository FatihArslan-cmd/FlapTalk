import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bounce } from 'react-native-animated-spinkit';
import CustomText from './components/CustomText';

const AuthButton = ({ style, iconName, text, onPress, showBounce, bounceColor, disabled }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled}>
    <Icon name={iconName} size={20} color={bounceColor || '#e6e6e6'} style={styles.icon} />
    <CustomText fontFamily="pop">
    <Text style={[styles.buttonText, bounceColor && { color: bounceColor }]}>{text}</Text>
    </CustomText>
    {showBounce && <Bounce size={24} color={bounceColor || 'white'} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0d0d0d',
    borderRadius: 30,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#e6e6e6',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default AuthButton;