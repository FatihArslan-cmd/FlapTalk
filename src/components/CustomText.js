import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import * as Font from 'expo-font';

const CustomText = ({ children, style, fontFamily }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'pop': require('../../assets/fonts/Poppins-Bold.ttf'),
        'bungee': require('../../assets/fonts/BungeeSpice-Regular.ttf'),
        'lato': require('../../assets/fonts/Lato-Regular.ttf'),
        'lato-bold': require('../../assets/fonts/Lato-Bold.ttf')
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <Text style={[style, { fontFamily }]}>
      {children}
    </Text>
  );
};

export default CustomText;
