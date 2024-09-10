// useNetworkStatus.js
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setAlertVisible(true);
      }
    });

    return () => {
      unsubscribeNetInfo(); // Unsubscribe when component unmounts
    };
  }, []);

  const handleRetry = () => {
    // Retry logic or simply hide the alert
    setAlertVisible(false);
  };

  return { isConnected, alertVisible, setAlertVisible, handleRetry };
};

export default useNetworkStatus;
