import React from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const FullScreenImageModal = ({ visible, imageUrl, onClose }) => {
  const downloadImage = async () => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        imageUrl,
        FileSystem.documentDirectory + 'downloaded_image.jpg'
      );
      const { uri } = await downloadResumable.downloadAsync();

      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <Image source={{ uri: imageUrl }} style={styles.fullScreenImage} />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadImage}>
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
  },
  downloadButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#000',
  },
});

export default FullScreenImageModal;
