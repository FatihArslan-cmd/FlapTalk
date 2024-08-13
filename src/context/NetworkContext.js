import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as Animatable from 'react-native-animatable';
import CustomText from '../components/CustomText';
import { StatusBar } from 'expo-status-bar';
export const NetworkContext = createContext();

// Create NetworkProvider component
export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [notificationColor, setNotificationColor] = useState(new Animated.Value(0)); // 0 for red, 1 for green

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      if (state.isConnected) {
        setNotificationText('Connection Restored');
        Animated.timing(notificationColor, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }).start();
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        setNotificationText('No Internet Connection');
        Animated.timing(notificationColor, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }).start();
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 20000);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isOnline }}>
    
      {children}
      {showNotification && (
        <Animatable.View animation="fadeInDown" style={[styles.notification, { backgroundColor: notificationColor.interpolate({
          inputRange: [0, 1],
          outputRange: ['red', 'green'],
        }) }]}>
            <StatusBar style="auto" />
          <CustomText fontFamily={'pop'} style={styles.notificationText}>{notificationText}</CustomText>
        </Animatable.View>
      )}
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop:15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
  },
});
