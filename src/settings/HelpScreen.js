import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { Foundation, Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import SettingsHeader from './SettingsHeader';
import CustomText from '../components/CustomText';
import { useTranslation } from 'react-i18next';
const HelpScreen = ({ navigation }) => {
  const {t} = useTranslation();
  const handleComplaintPress = () => {
    const email = 'fatiharslan1459@gmail.com'; // Replace with your email
    const subject = 'Kanalla ilgili şikayet';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  const handleComplaintPressGetHelp = () => {
    const email = 'fatiharslan1459@gmail.com'; // Replace with your email
    const subject = 'Yardıma ihtiyacım var';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };

  return (
    <View style={styles.container}>
      <SettingsHeader title={t('help')} onBackPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleComplaintPressGetHelp}>
          <Entypo name="help-with-circle" size={24} color="gray" style={styles.icon} />
          <View>
            <CustomText fontFamily={'pop'} style={styles.menuText}>{t('help_center_title')}</CustomText>
            <CustomText fontFamily={'pop'} style={styles.menuSubText}>{t('help_center_subtitle')}</CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="gray" style={styles.icon} />
          <CustomText fontFamily={'pop'} style={styles.menuText}>{t('terms_and_privacy')}</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleComplaintPress}>
          <Foundation name="megaphone" size={24} color="gray" style={styles.icon} />
          <CustomText fontFamily={'pop'} style={styles.menuText}>{t('channel_complaints')}</CustomText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('AppInfo')}>
          <MaterialCommunityIcons name="information-outline" size={24} color="gray" style={styles.icon} />
          <CustomText fontFamily={'pop'} style={styles.menuText}>{t('app_info')}</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#FAF9F6'
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
    color: '#757575',
    marginTop: 5,
  },
});

export default HelpScreen;
