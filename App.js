import React from 'react';
import { LogBox } from 'react-native';
import { NetworkProvider } from './src/context/NetworkContext';
import Navigation from './src/navigation/Navigation';
import { AuthProvider,AuthContext } from './src/context/AuthContext';
import { UserStatusProvider } from './src/context/UserStatusContext';
LogBox.ignoreAllLogs();

export default function App() {
  return (
    <UserStatusProvider>
    <NetworkProvider>
      <AuthProvider>
        <AuthContext.Consumer>
          {({ user }) => <Navigation user={user} />}
        </AuthContext.Consumer>
      </AuthProvider>
    </NetworkProvider>
    </UserStatusProvider>
  );
}
