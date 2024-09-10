import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, Entypo } from '@expo/vector-icons';
import CustomText from '../../components/CustomText';
import SettingsHeader from './SettingsHeader';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const { width, height } = Dimensions.get('window');

// List of 20 colors
const colors = [
  '#A8DADC', '#81C784', '#4CAF50', '#64B5F6', '#26C6DA',
  '#00ACC1', '#7986CB', '#5C6BC0', '#BA68C8', '#AB47BC',
  '#FF8A65', '#FF7043', '#D4E157', '#FFEB3B', '#FFCA28',
  '#FFB300', '#FDD835', '#8D6E63', '#A1887F', '#BDBDBD'
];

const ChatSettingsScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); // Use ThemeContext to access theme
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [wallpaperModalVisible, setWallpaperModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const loadColor = async () => {
      try {
        const color = await AsyncStorage.getItem('selectedColor');
        if (color !== null) {
          setSelectedColor(color);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadColor();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleThemePress = () => {
    setThemeModalVisible(true);
  };

  const handleWallpaperPress = () => {
    setWallpaperModalVisible(true);
  };

  const handleThemeSelection = (theme) => {
    if (theme === 'dark') {
      toggleTheme(); // Switch to dark mode
    } else if (theme === 'light') {
      toggleTheme(); // Switch to light mode
    }
    setThemeModalVisible(false);
  };

  const handleColorSelection = async (color) => {
    try {
      await AsyncStorage.setItem('selectedColor', color);
      setSelectedColor(color);
    } catch (e) {
      console.log(e);
    }
    setWallpaperModalVisible(false);
  };

  const handleDefaultSelection = async () => {
    try {
      await AsyncStorage.removeItem('selectedColor');
      setSelectedColor(null);
    } catch (e) {
      console.log(e);
    }
    setWallpaperModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FAF9F6' }]}>
      <SettingsHeader title={t('Chats')} onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <TouchableOpacity style={styles.item} onPress={handleThemePress}>
            <Entypo name="light-up" size={30} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
            <CustomText fontFamily={'pop'} style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>
              {t('theme')}
            </CustomText>
            <CustomText fontFamily={'pop'} style={styles.itemSubText}>
              {isDarkMode ? t('dark') : t('light')}
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={handleWallpaperPress}>
            <Ionicons name="image-outline" size={30} color={isDarkMode ? 'white' : 'black'} style={styles.icon} />
            <CustomText fontFamily={'pop'} style={[styles.itemText, { color: isDarkMode ? 'white' : 'black' }]}>
              {t('wallpaper')}
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        transparent={true}
        visible={themeModalVisible}
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
            <CustomText fontFamily={'pop'} style={[styles.modalTitle, { color: isDarkMode ? 'white' : '#757575' }]}>
              {t('selectTheme')}
            </CustomText>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleThemeSelection('light')}>
  <Entypo name="light-up" size={30} color={isDarkMode ? 'white' : 'black'} style={styles.modalIcon} />
  <CustomText fontFamily={'pop'} style={[styles.modalItemText, { color: isDarkMode ? 'white' : 'black' }]}>
    {t('light')}
  </CustomText>
</TouchableOpacity>
<TouchableOpacity style={styles.modalItem} onPress={() => handleThemeSelection('dark')}>
  <Ionicons name="moon-outline" size={30} color={isDarkMode ? 'white' : 'black'} style={styles.modalIcon} />
  <CustomText fontFamily={'pop'} style={[styles.modalItemText, { color: isDarkMode ? 'white' : 'black' }]}>
    {t('dark')}
  </CustomText>
</TouchableOpacity>
<TouchableOpacity style={styles.closeButton} onPress={() => setThemeModalVisible(false)}>
  <CustomText fontFamily={'pop'} style={[styles.closeButtonText]}>
    {t('close')}
  </CustomText>
</TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Wallpaper Selection Modal */}
      <Modal
        transparent={true}
        visible={wallpaperModalVisible}
        animationType="fade"
        onRequestClose={() => setWallpaperModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CustomText fontFamily={'pop'} style={[styles.modalTitle,{color: isDarkMode ? 'white' : '#757575'}]}>{t('selectColor')}</CustomText>
            <View style={styles.colorsContainer}>
              {colors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.colorBox, { backgroundColor: color }]}
                  onPress={() => handleColorSelection(color)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.modalItem} onPress={handleDefaultSelection}>
              <CustomText fontFamily={'pop'} style={[styles.modalItemText,{color: isDarkMode ? 'white' : '#757575'}]}>{t('defaultColor')}</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setWallpaperModalVisible(false)}>
              <CustomText fontFamily={'pop'} style={styles.closeButtonText}>{t('close')}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  section: {
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
    marginRight: 'auto',
  },
  itemSubText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  modalIcon:{
     marginRight:10
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  modalItemText: {
    fontSize: 16,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorBox: {
    width: (width * 0.8) / 5 - 10, // Adjust based on available space
    height: 50,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#009688',
    fontSize: 16,
  },
});

export default ChatSettingsScreen;
