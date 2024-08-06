import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import LoginScreen from '../LoginScreen';
import AppHomePage from '../AppHomePage';
import PhoneLoginScreen from '../phoneLoginScreen/PhoneLoginScreen';
import UserInfoScreen from '../components/UserInfoScreen';
import EmailLoginScreen from '../EmailScreen/EmailLoginScreen';
import EmailSignupScreen from '../EmailScreen/EmailSignupScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <LoginScreen />; // or handle navigation to login if user is not authenticated
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user.username ? 'AppHomePage' : 'LoginScreen'}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppHomePage" component={AppHomePage} options={{ headerShown: false }} initialParams={{ uid: user.uid }} />
        <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailLogin" component={EmailLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailSignup" component={EmailSignupScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
