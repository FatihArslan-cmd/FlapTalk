import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import SplashScreenComponent from '../components/SplashScreen';
import LoginScreen from '../LoginScreen';
import AppHomePage from '../AppHomePage';
import PhoneLoginScreen from '../phoneLoginScreen/PhoneLoginScreen';
import UserInfoScreen from '../components/UserInfoScreen';
import EmailLoginScreen from '../EmailScreen/EmailLoginScreen';
import EmailSignupScreen from '../EmailScreen/EmailSignupScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const { user } = useContext(AuthContext);
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    const loadSplashScreen = async () => {
      // If user is already authenticated, skip the splash screen
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

  const initialRouteName = user ? 'AppHomePage' : 'LoginScreen';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppHomePage" component={AppHomePage} options={{ headerShown: false }} initialParams={{ uid: user?.uid }} />
        <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailSignup" component={EmailSignupScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
