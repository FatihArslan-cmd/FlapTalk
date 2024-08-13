import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import CustomText from '../components/CustomText';
import { useNavigation } from '@react-navigation/native';

const PageItem = ({ imageUri, heading, text, showButton }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.page}>
      <Image
        style={styles.image}
        source={{ uri: imageUri }}
      />
      {heading && <Text style={styles.heading}>{heading}</Text>}
      <CustomText style={styles.text}>
        {text}
      </CustomText>
      {showButton && (
        <TouchableOpacity 
          onPress={() => navigation.navigate('AppHomePage')} 
          style={styles.closeButton}
        >
          <CustomText style={styles.closeButtonText}>Continue App...</CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PageItem;
