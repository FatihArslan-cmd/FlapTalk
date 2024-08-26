import React, { memo } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import CustomText from './CustomText';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const AlertComponent = ({
  visible,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
  cancelText = 'Cancel', // Optional cancel button text
  onCancel, // Optional cancel button action
  modalStyle = {}, // Allow custom styles
  buttonStyle = {},
  confirmButtonStyle = {},
  cancelButtonStyle = {},
  confirmTextStyle = {},
  cancelTextStyle = {}
}) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <BlurView intensity={50} style={styles.absolute} tint="dark" />
          {visible && <StatusBar style="light" backgroundColor="rgba(0,0,0,0.5)" translucent />}

          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalView, modalStyle]}>
              <CustomText fontFamily={'pop'} style={styles.modalTitle}>{title}</CustomText>
              <CustomText fontFamily={'pop'} style={styles.modalMessage}>{message}</CustomText>
              <View style={styles.buttonContainer}>
                {onCancel && (
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton, cancelButtonStyle]} 
                    onPress={onCancel}
                    accessibilityLabel="Cancel"
                    accessibilityRole="button"
                  >
                    <CustomText fontFamily={'pop'} style={[styles.buttonText, cancelTextStyle]}>{cancelText}</CustomText>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.button, confirmButtonStyle]} 
                  onPress={onConfirm}
                  accessibilityLabel="Confirm"
                  accessibilityRole="button"
                >
                  <CustomText fontFamily={'pop'} style={[styles.buttonText, confirmTextStyle]}>{confirmText}</CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>

        </View>
      </TouchableWithoutFeedback>
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
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
  },
});

export default memo(AlertComponent);
