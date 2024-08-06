import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

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
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title} </Text>
          <Text style={styles.modalMessage}>{message} </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onConfirm}>
              <Text style={styles.buttonText}>{confirmText} </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  modalView: {
    margin: width * 0.05,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: width * 0.08,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
});

export default AlertComponent;
