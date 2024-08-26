import React, { useRef, useEffect, } from 'react';
import { View, StyleSheet, Dimensions, Animated,Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Bounce } from 'react-native-animated-spinkit';

const { width } = Dimensions.get('window');

const SplashScreenComponent = ({ onAnimationEnd }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
      delay: 2000, // Delay the fade-out for 2 seconds
      useNativeDriver: true,
    }).start(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    });
  }, [fadeAnim, onAnimationEnd]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animatable.View 
        animation="bounceIn" 
        duration={2000} 
        style={styles.circle}
      >
        <Animatable.View 
          animation="pulse" 
          iterationCount="infinite" 
          direction="alternate"
        >
          <Text style={styles.text} fontFamily="pop">FlapTalk</Text>
        </Animatable.View>
      </Animatable.View>
      <Bounce 
        size={width * 0.10} 
        color="#FFFFFF" 
        style={styles.spinner}
      />
      <Text style={styles.versionText} fontFamily="pop">
        Version 2.4.3
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00ae59',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: (width * 0.5) / 2,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#00ae59',
    fontSize: 24,
  },
  spinner: {
    marginTop: 20,
  },
  versionText: {
    color: 'white',
    position: 'absolute',
    bottom: width * 0.15, // Adjust the distance from the bottom
  },
});

export default SplashScreenComponent;
