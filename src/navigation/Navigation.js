import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../LoginScreen';
import AppHomePage from '../AppHomePage';
import PhoneLoginScreen from '../phoneLoginScreen/PhoneLoginScreen';
import UserInfoScreen from '../components/UserInfoScreen';

const Stack = createStackNavigator();

const Navigation = ({ user }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'AppHomePage' : 'LoginScreen'}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AppHomePage" component={AppHomePage} options={{ headerShown: false }}
          initialParams={{ uid: user ? user.uid : null }} />
        <Stack.Screen name="PhoneLoginScreen" component={PhoneLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
