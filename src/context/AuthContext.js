import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import LoadingOverlay from '../components/LoadingOverlay';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const onAuthStateChanged = async (user) => {
    if (user) {
      await AsyncStorage.setItem('userToken', 'logged_in');
      await AsyncStorage.setItem('uid', user.uid);

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const username = userDoc.exists ? userDoc.data().username : null;

      setUser({ uid: user.uid, username });
    } else {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('uid');
      setUser(null);
    }
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const [userToken, uid] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('uid')
        ]);

        if (userToken && uid) {
          const userDoc = await firestore().collection('users').doc(uid).get();
          const username = userDoc.exists ? userDoc.data().username : null;
          setUser({ uid, username });
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setInitializing(false);
      }
    };
    checkUserToken();
  }, []);

  if (initializing) return <LoadingOverlay visible={true} />;

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
