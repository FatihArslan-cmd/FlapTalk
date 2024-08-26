import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import * as Font from 'expo-font';
import SkeletonPlaceholder from '../../Skeleton'; // Import the SkeletonPlaceholder component

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
    return (
      <View style={style}>
        <SkeletonPlaceholder width={100} height={20} borderRadius={4} />
      </View>
    );
  }

  return (
    <Text style={[style, { fontFamily }]}>
      {children}
    </Text>
  );
};

export default CustomText;
