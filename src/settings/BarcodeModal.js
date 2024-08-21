import React from 'react';
import { Modal, View, Text, Button } from 'react-native';
import { Barcode } from 'expo-barcode-generator';

const BarcodeModal = ({ barcodeVisible, setBarcodeVisible, username }) => {
  return (
    <Modal visible={barcodeVisible} transparent={true} animationType="fade">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ width: '80%', padding: 20, backgroundColor: '#fff', borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Barcode for {username}</Text>
          <Barcode
            format="CODE128"
            value={username || 'unknown'}
            text={username || 'unknown'}
          />
          <Button title="Close" onPress={() => setBarcodeVisible(false)} />
        </View>
      </View>
    </Modal>
  );
};

export default BarcodeModal;
