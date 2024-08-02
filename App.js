import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/LoginScreen';
import Detail from './src/Detail';
import AppHomePage from './src/AppHomePage';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}} />
        <Stack.Screen name="Details" component={Detail} options={{headerShown:false}}/>
        <Stack.Screen name="AppHomePage" component={AppHomePage} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

