import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CustomText from './CustomText';
import ClearButton from './renderClearButton';

const AppHeader = ({ title, textColor, showCameraIcon, onSearch }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setSearchText('');
      setIsSearching(false);
      if (onSearch) onSearch(''); 
    }, [])
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
    <View style={styles.header}>
      {isSearching ? (
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={28} color="black" style={styles.closeIcon} />
          </TouchableOpacity>
          <Icon name="search" size={28} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.textInput}
            placeholder="Search"
            value={searchText}
            onChangeText={handleSearchTextChange}
          />
          <ClearButton value={searchText} setValue={handleClearSearch} />
        </View>
      ) : (
        <>
          <CustomText fontFamily={'pop'} style={[styles.headerText, { color: textColor }]}>
            {title}
          </CustomText>
          <View style={styles.iconContainer}>
            {showCameraIcon && (
              <TouchableOpacity onPress={handleCameraPress}>
                <MaterialCommunityIcons name="camera" size={28} color="black" style={styles.inputIcon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Icon name="search" size={28} color="black" style={styles.inputIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleMenuPress('Introduction')}>
              <MaterialCommunityIcons name="dots-vertical" size={28} color="black" style={styles.inputIcon} />
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
    borderBottomColor: '#ccc',
    fontSize: 18,
    padding: 5,
  },
});

export default AppHeader;
