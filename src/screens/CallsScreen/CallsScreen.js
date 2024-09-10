import { View } from 'react-native';
import React, { useContext } from 'react';
import AppHeader from '../../components/AppHeader';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const CallsScreen = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for theme

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#121212' : '#FAF9F6' }}>
      <AppHeader title={t('Calls')} textColor={isDarkMode ? 'white' : 'black'} />
    </View>
  );
};

export default CallsScreen;
