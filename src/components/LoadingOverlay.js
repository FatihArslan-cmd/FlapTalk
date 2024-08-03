import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Bounce } from 'react-native-animated-spinkit';

const LoadingOverlay = ({ visible }) => {
  const { width, height } = Dimensions.get('window');
  const spinnerSize = Math.min(width, height) * 0.12; // 12% of the smaller screen dimension

  if (!visible) return null;
  return (
    <View style={styles.loadingOverlay}>
      <Bounce size={spinnerSize} color="#0d0d0d" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default LoadingOverlay;
