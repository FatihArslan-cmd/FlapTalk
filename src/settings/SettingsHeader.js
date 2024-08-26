import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../components/CustomText';
const SettingsHeader = ({ title, onBackPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <CustomText fontFamily={'pop'} style={styles.title}>{title}</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop:40
  },
  iconContainer: {
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
  },
});

export default SettingsHeader;