import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import CustomText from './CustomText';
import ClearButton from './renderClearButton';

const AppHeader = ({ title, textColor, showCameraIcon, onSearch }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
  
    // Reset search mode when navigating away
    useFocusEffect(
      useCallback(() => {
        return () => {
          setIsSearching(false);
          setSearchText('');
        };
      }, [])
    );
  
    const handleSearchTextChange = (text) => {
      setSearchText(text);
      onSearch(text); // Call the onSearch callback
    };
  
    return (
      <View style={styles.header}>
        {isSearching ? (
          <View style={styles.searchContainer}>
            <TouchableOpacity onPress={() => setIsSearching(false)}>
              <Icon name="arrow-back" size={28} color="black" style={styles.closeIcon} />
            </TouchableOpacity>
            <Icon name="search" size={28} color="black" style={styles.searchIcon} />
            <TextInput
              style={styles.textInput}
              placeholder="Search"
              value={searchText}
              onChangeText={handleSearchTextChange} // Use the new handler
            />
            <ClearButton value={searchText} setValue={setSearchText} />
          </View>
        ) : (
          <>
            <CustomText fontFamily={'pop'} style={[styles.headerText, { color: textColor }]}>
              {title}
            </CustomText>
            <View style={styles.iconContainer}>
              {showCameraIcon && (
                <MaterialCommunityIcons name="camera" size={28} color="black" style={styles.inputIcon} />
              )}
              <TouchableOpacity onPress={() => setIsSearching(true)}>
                <Icon name="search" size={28} color="black" style={styles.inputIcon} />
              </TouchableOpacity>
              <MaterialCommunityIcons name="dots-vertical" size={28} color="black" style={styles.inputIcon} />
            </View>
          </>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    header: {
      height: 65,
      justifyContent: 'center',
      borderBottomColor: '#ccc',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingTop: 15,
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
    clearButton: {
      padding: 5,
    },
  });
  
  export default AppHeader;