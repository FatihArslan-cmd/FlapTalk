import React, { useState, useCallback, useContext } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomText from './CustomText';
import ClearButton from './renderClearButton';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const AppHeader = ({ title, textColor, showCameraIcon, onSearch }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for theme

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      setIsSearching(false);
      if (onSearch) onSearch('');
    }, [onSearch])
  );

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    if (onSearch) onSearch(text);
  };

  const handleClearSearch = () => {
    setSearchText('');
    if (onSearch) onSearch('');
  };

  const handleBackPress = () => {
    setIsSearching(false);
    handleClearSearch();
  };

  const handleCameraPress = () => {
    navigation.navigate('CameraScreen'); // Navigates to the CameraScreen
  };

  return (
    <View style={[styles.header, { backgroundColor: isDarkMode ? '#121212' : '#FAF9F6' }]}>
      {isSearching ? (
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={28} color={isDarkMode ? 'white' : 'black'} style={styles.closeIcon} />
          </TouchableOpacity>
          <Icon name="search" size={28} color={isDarkMode ? 'white' : 'black'} style={styles.searchIcon} />
          <TextInput
            style={[styles.textInput, { color: isDarkMode ? 'white' : 'black', borderBottomColor: isDarkMode ? '#757575' : '#ccc' }]}
            placeholder={t('Search')}
            placeholderTextColor={isDarkMode ? '#757575' : '#999'}
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          <ClearButton value={searchText} setValue={handleClearSearch} />
        </View>
      ) : (
        <>
          <CustomText fontFamily={'pop'} style={[styles.headerText, { color: textColor || (isDarkMode ? 'white' : 'black') }]}>
            {title}
          </CustomText>
          <View style={styles.iconContainer}>
            {showCameraIcon && (
              <TouchableOpacity onPress={handleCameraPress}>
                <MaterialCommunityIcons
                  name="camera"
                  size={28}
                  color={isDarkMode ? 'white' : 'black'}
                  style={styles.inputIcon}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Icon name="search" size={28} color={isDarkMode ? 'white' : 'black'} style={styles.inputIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuPress('Introduction')}>
              <MaterialCommunityIcons name="dots-vertical" size={28} color={isDarkMode ? 'white' : 'black'} style={styles.inputIcon} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    justifyContent: 'center',
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 5 // Add some shadow if needed

  },
  headerText: {
    fontSize: 26,
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  inputIcon: {
    margin: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeIcon: {
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    borderBottomWidth: 1,
    fontSize: 18,
    padding: 5,
  },
});

export default AppHeader;
