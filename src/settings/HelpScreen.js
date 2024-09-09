import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { Foundation, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import SettingsHeader from './SettingsHeader';
import CustomText from '../components/CustomText';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const HelpScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for theme

  const handleComplaintPress = () => {
    const email = 'fatiharslan1459@gmail.com';
    const subject = 'Kanalla ilgili şikayet';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  const handleComplaintPressGetHelp = () => {
    const email = 'fatiharslan1459@gmail.com';
    const subject = 'Yardıma ihtiyacım var';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FAF9F6' }]}>
      <SettingsHeader title={t('help')} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleComplaintPressGetHelp}>
          <Entypo name="help-with-circle" size={24} color={isDarkMode ? 'white' : 'gray'} style={styles.icon} />
          <View>
            <CustomText fontFamily={'pop'} style={[styles.menuText, { color: isDarkMode ? 'white' : 'black' }]}>
              {t('help_center_title')}
            </CustomText>
            <CustomText fontFamily={'pop'} style={[styles.menuSubText, { color: isDarkMode ? '#E0E0E0' : '#757575' }]}>
              {t('help_center_subtitle')}
            </CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color={isDarkMode ? 'white' : 'gray'} style={styles.icon} />
          <CustomText fontFamily={'pop'} style={[styles.menuText, { color: isDarkMode ? 'white' : 'black' }]}>
            {t('terms_and_privacy')}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleComplaintPress}>
          <Foundation name="megaphone" size={24} color={isDarkMode ? 'white' : 'gray'} style={styles.icon} />
          <CustomText fontFamily={'pop'} style={[styles.menuText, { color: isDarkMode ? 'white' : 'black' }]}>
            {t('channel_complaints')}
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AppInfo')}>
          <MaterialCommunityIcons name="information-outline" size={24} color={isDarkMode ? 'white' : 'gray'} style={styles.icon} />
          <CustomText fontFamily={'pop'} style={[styles.menuText, { color: isDarkMode ? 'white' : 'black' }]}>
            {t('app_info')}
          </CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuSubText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default HelpScreen;
