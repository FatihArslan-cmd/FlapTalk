import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/CustomText';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const SettingsHeader = ({ title, onBackPress }) => {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <TouchableOpacity onPress={onBackPress} style={styles.iconContainer}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
      </TouchableOpacity>
      <CustomText fontFamily={'pop'} style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
        {title}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    paddingTop: 40,
  },
  iconContainer: {
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
  },
});

export default SettingsHeader;
