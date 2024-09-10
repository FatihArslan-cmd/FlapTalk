import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import SettingsHeader from './SettingsHeader';
import { AntDesign } from '@expo/vector-icons';
import CustomText from '../../components/CustomText';
import AlertComponent from '../../components/AlertComponent';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext'; // ThemeContext'i ekledik

const AccountScreen = ({ navigation }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertProps, setAlertProps] = useState({});
  const { t } = useTranslation();
  const { isDarkMode } = useContext(ThemeContext); // Dark theme durumunu kontrol ediyoruz

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleDeleteAccount = () => {
    const user = firebase.auth().currentUser;

    if (confirmationText === 'CONFIRM') {
      if (user) {
        user.delete()
          .then(() => {
            setAlertProps({
              title: 'Account Deleted',
              message: 'Your account has been deleted successfully.',
              confirmText: 'OK',
              onConfirm: () => {
                setAlertVisible(false);
                setModalVisible(false);
                navigation.navigate('LoginScreen');
              },
            });
            setAlertVisible(true);
          })
          .catch((error) => {
            if (error.code === 'auth/requires-recent-login') {
              setAlertProps({
                title: 'Reauthentication Required',
                message: 'Please re-login to delete the account',
                confirmText: 'OK',
                onConfirm: () => {
                  setAlertVisible(false);
                  setModalVisible(false);
                },
              });
              setAlertVisible(true);
            } else {
              setAlertProps({
                title: 'Error',
                message: error.message,
                confirmText: 'OK',
                onConfirm: () => {
                  setAlertVisible(false);
                  setModalVisible(false);
                },
              });
              setAlertVisible(true);
            }
          });
      }
    } else {
      setAlertProps({
        title: 'Incorrect Confirmation',
        message: 'Please type "CONFIRM" to delete your account.',
        confirmText: 'OK',
        onConfirm: () => setAlertVisible(false),
      });
      setAlertVisible(true);
    }
  };

  const openConfirmationModal = () => {
    setConfirmationText('');
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <SettingsHeader title={t('account')} onBackPress={handleBackPress} />
      <TouchableOpacity style={styles.deleteButton} onPress={openConfirmationModal}>
        <AntDesign name="deleteuser" size={24} color={isDarkMode ? '#fff' : 'gray'} style={styles.icon} />
        <CustomText fontFamily={'pop'} style={[styles.deleteButtonText, { color: isDarkMode ? '#fff' : 'black' }]}>{t('deleteAccount')}</CustomText>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
            <CustomText fontFamily={'pop'} style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              Confirm Account Deletion
            </CustomText>
            <CustomText fontFamily={'pop'} style={[styles.modalMessage, { color: isDarkMode ? '#ccc' : '#000' }]}>
              To delete your account, type "CONFIRM" below and press the confirm button.
            </CustomText>
            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' }]}
              placeholder="CONFIRM"
              placeholderTextColor={isDarkMode ? '#999' : '#aaa'}
              value={confirmationText}
              onChangeText={setConfirmationText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.cancelButton, { backgroundColor: isDarkMode ? '#666' : '#ccc' }]} onPress={() => setModalVisible(false)}>
                <CustomText fontFamily={'pop'} style={styles.cancelButtonText}>Cancel</CustomText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDeleteAccount}>
                <CustomText fontFamily={'pop'} style={styles.confirmButtonText}>Confirm</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AlertComponent
        visible={alertVisible}
        title={alertProps.title}
        message={alertProps.message}
        confirmText={alertProps.confirmText}
        onConfirm={alertProps.onConfirm}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  deleteButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  deleteButtonText: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AccountScreen;
