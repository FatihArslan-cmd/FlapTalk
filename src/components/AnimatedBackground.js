// AnimatedBackground.js
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const AnimatedBackground = ({ colors, children }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = colors.map((_, index) => {
      return Animated.sequence([
        Animated.timing(animation, {
          toValue: index + 1,
          duration: 450,
          useNativeDriver: false,
        }),
        Animated.delay(2000),
      ]);
    });

    const animationLoop = Animated.loop(Animated.sequence(animations));
    animationLoop.start();

    return () => animationLoop.stop(); // Cleanup function to stop animation
  }, [animation]);

  const interpolateBackgroundColor = animation.interpolate({
    inputRange: [0, ...colors.map((_, index) => index + 1), colors.length + 1],
    outputRange: [colors[colors.length - 1], ...colors, colors[0]],
  });

  return (
    <Animated.View style={{ flex: 1, backgroundColor: interpolateBackgroundColor }}>
      {children}
    </Animated.View>
  );
};

export default AnimatedBackground;
