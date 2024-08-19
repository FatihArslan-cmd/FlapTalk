import { useState, useCallback } from 'react';

const useAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const showAlert = useCallback((alertTitle, alertMessage, confirmAction = () => {}) => {
    setTitle(alertTitle);
    setMessage(alertMessage);
    setOnConfirm(() => confirmAction);
    setIsVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setIsVisible(false);
  }, []);

  const confirmAlert = useCallback(() => {
    onConfirm();
    hideAlert();
  }, [onConfirm, hideAlert]);

  return {
    isVisible,
    title,
    message,
    showAlert,
    hideAlert,
    confirmAlert,
  };
};

export default useAlert;
