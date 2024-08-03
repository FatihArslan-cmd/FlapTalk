import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Header = ({ text }) => {
  return <Text style={styles.headerText}>{text}</Text>;
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
});

export default Header;
