import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { Foundation, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons'; // İkonlar için
import SettingsHeader from './SettingsHeader';
import CustomText from '../components/CustomText';
import { Entypo } from '@expo/vector-icons';
const HelpScreen = ({ navigation }) => {
  const handleComplaintPress = () => {
    const email = 'fatiharslan1459@gmail.com'; // Kendi e-posta adresinizi buraya koyun
    const subject = 'Kanalla ilgili şikayet';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };
  const handleComplaintPressGetHelp = () => {
    const email = 'fatiharslan1459@gmail.com'; // Kendi e-posta adresinizi buraya koyun
    const subject = 'Yardıma  ihtiyacım var';

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailtoUrl);
  };
  return (
    <View style={styles.container}>
      <SettingsHeader title="Yardım" onBackPress={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleComplaintPressGetHelp}>
          <Entypo name="help-with-circle" size={24} color="gray" style={styles.icon} />
          <View>
            <CustomText fontFamily={'pop'} style={styles.menuText}>Yardım merkezi</CustomText>
            <CustomText fontFamily={'pop'} style={styles.menuSubText}>Yardım alın, bize ulaşın</CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="gray" style={styles.icon} />
          <CustomText fontFamily={'pop'} style={styles.menuText}>Koşullar ve Gizlilik İlkesi</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleComplaintPress}>
          <Foundation name="megaphone" size={24} color="gray" style={styles.icon} />
          <CustomText fontFamily={'pop'} style={styles.menuText}>Kanalla ilgili şikayetler</CustomText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="information-outline" size={24} color="gray" style={styles.icon} />
          <CustomText fontFamily={'pop'} style={styles.menuText}>Uygulama bilgileri</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
