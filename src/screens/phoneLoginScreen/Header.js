import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import CustomText from '../../components/CustomText';

const { width, height } = Dimensions.get('window');

const Header = ({ text, fontFamily = 'lato-bold', color = '#000', fontSize = width * 0.06 }) => {
  return (
    <CustomText style={[styles.headerText, { color, fontSize }]} fontFamily={fontFamily}>
      {text}
    </CustomText>
  );
};

const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
});

export default Header;
