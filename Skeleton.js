import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonPlaceholder = ({ width, height, borderRadius = 4 }) => {
  const animatedValue = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const interpolatedBackground = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E0E0E0', '#F5F5F5'],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, backgroundColor: interpolatedBackground },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 8,
  },
});

export default SkeletonPlaceholder;
