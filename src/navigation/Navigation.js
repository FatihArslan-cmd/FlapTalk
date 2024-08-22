import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreenComponent from '../components/SplashScreen';
import LoginScreen from '../LoginScreen';
import PhoneLoginScreen from '../phoneLoginScreen/PhoneLoginScreen';
import UserInfoScreen from '../components/UserInfoScreen';
import EmailLoginScreen from '../EmailScreen/EmailLoginScreen';
import EmailSignupScreen from '../EmailScreen/EmailSignupScreen';
import TabNavigator from './TabNavigator';
import ChatRoom from '../ChatScreen/ChatRoom';
import VideoCallScreen from '../CallsScreen/VideoCallScreen';
import CameraScreen from '../Scanner/CameraScreen';
import HelpScreen from '../settings/HelpScreen';
const Stack = createStackNavigator();

const Navigation = () => {
  const { user } = useContext(AuthContext);
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    const loadSplashScreen = async () => {
      if (user) {
        setSplashReady(true);
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSplashReady(true);
    };
    loadSplashScreen();
  }, [user]);

  const handleAnimationEnd = () => {
    setSplashReady(true);
  };

  if (!isSplashReady) {
    return <SplashScreenComponent onAnimationEnd={handleAnimationEnd} />;
  }

  const initialRouteName = user ? 'MainApp' : 'LoginScreen';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainApp" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailSignup" component={EmailSignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ headerShown: false }} />
        <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
