import React from 'react';
import { LogBox } from 'react-native';
import { NetworkProvider } from './src/context/NetworkContext';
import Navigation from './src/navigation/Navigation';
import { AuthProvider,AuthContext } from './src/context/AuthContext';
import { UserStatusProvider } from './src/context/UserStatusContext';
import { NavigationBarProvider } from './src/context/NavigationBarContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ThemeProvider } from './src/context/ThemeContext';
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <ThemeProvider>
     <LanguageProvider>
      <NavigationBarProvider>
       <UserStatusProvider>
        <NetworkProvider>
        <AuthProvider>
         <AuthContext.Consumer>
           {({ user }) => <Navigation user={user} />}
         </AuthContext.Consumer>
        </AuthProvider>
      </NetworkProvider>
      </UserStatusProvider>
     </NavigationBarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
