import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import CustomText from '../components/CustomText';
import SettingsHeader from './SettingsHeader';

const { width, height } = Dimensions.get('window');

const ChatSettingsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Varsayılan sistem ayarı');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleThemePress = () => {
    setModalVisible(true);
  };

  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <SettingsHeader title="Sohbetler" onBackPress={handleBackPress} />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <CustomText fontFamily={'pop'} style={styles.sectionTitle}>Görüntüleme</CustomText>
          <TouchableOpacity style={styles.item} onPress={handleThemePress}>
            <Entypo name="light-up" size={30} color="black" style={styles.icon} />
            <CustomText fontFamily={'pop'} style={styles.itemText}>Tema</CustomText>
            <CustomText fontFamily={'pop'} style={styles.itemSubText}>{selectedTheme}</CustomText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <Ionicons name="image-outline" size={30} color="black" style={styles.icon} />
            <CustomText fontFamily={'pop'} style={styles.itemText}>Duvar kağıdı</CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <CustomText fontFamily={'pop'} style={styles.modalTitle}>Tema Seç</CustomText>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleThemeSelection('Açık')}>
            <Entypo name="light-up" size={30} color="black" style={styles.modalIcon} />
              <CustomText fontFamily={'pop'} style={styles.modalItemText}>Açık</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => handleThemeSelection('Koyu')}>
              <Ionicons name="moon-outline" size={30} color="black" style={styles.modalIcon} />
              <CustomText fontFamily={'pop'} style={styles.modalItemText}>Koyu</CustomText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <CustomText fontFamily={'pop'} style={styles.closeButtonText}>Kapat</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#757575',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 16,
    marginRight: 'auto'
  },
  itemSubText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#757575',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  modalIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#00ae59',
    marginLeft: 5,
  },
});

export default ChatSettingsScreen;
