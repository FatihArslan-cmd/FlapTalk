import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; // for the user icons
import SettingsHeader from './SettingsHeader';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';
const FavoritesScreen = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <SettingsHeader title={'Favorites'} onBackPress={handleBackPress}/>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.favoritesHeader}>
          <FastImage source={require('../../assets/Wavy_Bus-22_Single-11.jpg')} 
          resizeMode={FastImage.resizeMode.cover}
          style={[styles.favoritesImage, { width: width * 0.6, height: width * 0.4 }]} />
          <CustomText fontFamily={'pop'} style={styles.favoritesTitle}>Favorites</CustomText>
          <CustomText fontFamily={'pop'} style={styles.favoritesDescription}>
            Make it easy to find the people that matter most across WhatsApp.
          </CustomText>
        </View>
        <View style={styles.favoritesList}>
          <CustomText fontFamily={'pop'} style={styles.favoritesListTitle}>Favorites</CustomText>
          <View style={styles.favoriteItem}>
            <FontAwesome name="user-circle" size={40} color="black" />
            <CustomText fontFamily={'pop'} style={styles.favoriteName}>Anne</CustomText>
          </View>
          <View style={styles.favoriteItem}>
            <FontAwesome name="user-circle" size={40} color="black" />
            <CustomText fontFamily={'pop'} style={styles.favoriteName}>🚒</CustomText>
          </View>
        </View>

        {/* Add Favorite */}
        <TouchableOpacity style={styles.addFavoriteButton}>
          <Ionicons name="add-circle-outline" size={40} color="green" />
          <CustomText fontFamily={'pop'} style={styles.addFavoriteText}>Add favorite</CustomText>
        </TouchableOpacity>

        {/* Footer Text */}
        <CustomText fontFamily={'pop'} style={styles.footerText}>
          You can edit favorites here or reorder how they appear on the Calls tab.
        </CustomText>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  favoritesHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  favoritesImage: {
    resizeMode: 'contain',
    marginBottom: 10,
  },
  favoritesTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  favoritesDescription: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  favoritesList: {
    marginTop: 20,
  },
  favoritesListTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  favoriteName: {
    fontSize: 18,
    marginLeft: 10,
  },
  addFavoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  addFavoriteText: {
    fontSize: 18,
    color: 'green',
    marginLeft: 10,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
    paddingHorizontal: 20,
  },
});

export default FavoritesScreen;
