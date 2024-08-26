import React, { useEffect, useState, memo } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import SkeletonPlaceholder from '../../Skeleton'; // Import the SkeletonPlaceholder component

const useFonts = (fontMap) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    async function loadFonts() {
      await Font.loadAsync(fontMap);
      if (isMounted) {
        setFontsLoaded(true);
      }
    }

    loadFonts();

    return () => {
      isMounted = false; // Cleanup if the component unmounts
    };
  }, [fontMap]);

  return fontsLoaded;
};

const CustomText = ({ children, style, fontFamily = 'lato' }) => {
  const fontsLoaded = useFonts({
    'pop': require('../../assets/fonts/Poppins-Bold.ttf'),
    'bungee': require('../../assets/fonts/BungeeSpice-Regular.ttf'),
    'lato': require('../../assets/fonts/Lato-Regular.ttf'),
    'lato-bold': require('../../assets/fonts/Lato-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <>
        <SkeletonPlaceholder width={100} height={20} borderRadius={4} />
      </>
    );
  }

  return (
    <Text style={[style, { fontFamily }]}>
      {children}
    </Text>
  );
};

export default memo(CustomText);
