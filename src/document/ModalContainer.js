import React, { useState, useContext } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import PagerContent from './PagerContent';

const ModalContainer = ({ visible, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.centeredView, styles.lightBackground]}>
        <View style={[styles.modalView,  styles.lightModal]}>
          <PagerContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
  },
  darkBackground: {
    backgroundColor: '#333333',
  },
  lightBackground: {
    backgroundColor: '#ffffff',
  },
  modalView: {
    width: '90%',
    height: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkModal: {
    backgroundColor: '#444444',
  },
  lightModal: {
    backgroundColor: '#ffffff',
  },
});

export default ModalContainer;
