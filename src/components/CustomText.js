import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Font from 'expo-font';
import LoadingOverlay from './LoadingOverlay';

const CustomText = ({ children, style, fontFamily }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      setFontsLoaded(false); // Set loading state to true
      await Font.loadAsync({
        'pop': require('../../assets/fonts/Poppins-Bold.ttf'),
        'bungee': require('../../assets/fonts/BungeeSpice-Regular.ttf'),
        'lato': require('../../assets/fonts/Lato-Regular.ttf'),
        'lato-bold': require('../../assets/fonts/Lato-Bold.ttf'),
      });
      setFontsLoaded(true); // Set loading state to false
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Text style={[style, { fontFamily }]}>
      {children}
    </Text>
  );
};

export default CustomText;
