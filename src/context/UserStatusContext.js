import React, { createContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import { firebase } from '@react-native-firebase/auth';
const UserStatusContext = createContext();

const UserStatusProvider = ({ children }) => {
  const [status, setStatus] = useState('offline');

  useEffect(() => {
    const userId = firebase.auth().currentUser?.uid;

    const setUserStatus = async (status) => {
      if (userId) {
        await firestore().collection('users').doc(userId).update({ state: status });
        setStatus(status);
      }
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        setUserStatus('online');
      } else {
        setUserStatus('offline');
      }
    };

    if (userId) {
      const unsubscribeNetInfo = NetInfo.addEventListener(state => {
        if (state.isConnected) {
          setUserStatus('online');
        } else {
          setUserStatus('offline');
        }
      });

      const unsubscribeAppState = AppState.addEventListener('change', handleAppStateChange);

      // Set user offline when the component unmounts
      return () => {
        setUserStatus('offline');
        unsubscribeNetInfo();
        unsubscribeAppState.remove();
      };
    }
  }, []);

  return (
    <UserStatusContext.Provider value={status}>
      {children}
    </UserStatusContext.Provider>
  );
};

export { UserStatusProvider, UserStatusContext };
