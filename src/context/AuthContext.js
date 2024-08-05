import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        await AsyncStorage.setItem('userToken', 'logged_in');
        await AsyncStorage.setItem('uid', user.uid); // Store the uid
      } else {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('uid'); // Remove the uid
      }
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const uid = await AsyncStorage.getItem('uid');
        if (userToken && uid) {
          setUser({ uid }); // Set the user state with the uid
        }
        setInitializing(false);
      } catch (e) {
        console.error(e);
      }
    };
    checkUserToken();
  }, []);

  if (initializing) return null; // veya bir yükleniyor ekranı gösterebilirsiniz

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
