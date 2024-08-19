import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import CustomText from './CustomText';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const AlertComponent = ({ visible, onClose, title, message, onConfirm, confirmText }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        {/* Arka planı blur yapmak için BlurView kullanımı */}
        <BlurView intensity={50} style={styles.absolute} tint="dark" />
        {/* Modal açıldığında gri arka plan ve beyaz içerik için StatusBar'ı ayarla */}
        {visible && <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" translucent />}
        <View style={styles.modalView}>
          <CustomText fontFamily={'pop'} style={styles.modalTitle}>{title}</CustomText>
          <CustomText fontFamily={'pop'} style={styles.modalMessage}>{message}</CustomText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <CustomText fontFamily={'pop'} style={styles.buttonText}>{confirmText}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Modal kapandığında eski duruma dön */}
      {!visible && <StatusBar style="dark" backgroundColor="#FFFFFF" translucent />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalView: {
    margin: width * 0.05,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.09,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height * 0.005,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: width * 0.060,
    marginBottom: height * 0.02,
  },
  modalMessage: {
    marginBottom: height * 0.04,
    textAlign: 'center',
    fontSize: width * 0.040,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#00ae59',
    borderRadius: 10,
    padding: height * 0.010,
    margin: width * 0.01,
    flex: 1,
    alignItems: 'center',
    fontSize: width * 0.040,
  },
  buttonText: {
    color: 'white',
  },
});

export default AlertComponent;
