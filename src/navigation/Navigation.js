import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreenComponent from '../components/SplashScreen';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import PhoneLoginScreen from '../screens/phoneLoginScreen/PhoneLoginScreen';
import UserInfoScreen from '../components/UserInfoScreen';
import EmailLoginScreen from '../screens/EmailScreen/EmailLoginScreen';
import EmailSignupScreen from '../screens/EmailScreen/EmailSignupScreen';
import TabNavigator from './TabNavigator';
import ChatRoom from '../screens/ChatScreen/ChatRoom';
import VideoCallScreen from '../screens/CallsScreen/VideoCallScreen';
import CameraScreen from '../Scanner/CameraScreen';
import HelpScreen from '../screens/settings/HelpScreen';
import AppInfo from '../screens/settings/AppInfo';
import ChatSettingsScreen from '../screens/settings/ChatSettingScreen';
import FavoritesScreen from '../screens/settings/FavoritesScreen';
import AccountScreen from '../screens/settings/AccountScreen';
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
        <Stack.Screen name="AppInfo" component={AppInfo} options={{ headerShown: false }} />
        <Stack.Screen name="ChatSettingScreen" component={ChatSettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
