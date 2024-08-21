import React from "react";
import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import CustomText from "../components/CustomText";

const MenuList = ({ searchText, setBarcodeVisible, showAlert }) => {
  const menuItems = [
    { icon: 'key-outline', label: 'Hesap', subLabel: 'Güvenlik bildirimleri, numara değiştirme' },
    { icon: 'lock-closed-outline', label: 'Gizlilik', subLabel: 'Kişileri engelleme, süreli mesajlar' },
    { icon: 'person-circle-outline', label: 'Avatar', subLabel: 'Oluşturma, düzenleme, profil fotoğrafı' },
    { icon: 'heart-outline', label: 'Favoriler', subLabel: 'Ekle, yeniden sırala, çıkar' },
    { icon: 'chatbubble-outline', label: 'Sohbetler', subLabel: 'Tema, duvar kağıtları, sohbet geçmişi' },
    { icon: 'notifications-outline', label: 'Bildirimler', subLabel: 'Mesaj, grup ve arama sesleri' },
    { icon: 'people-outline', label: 'Arkadaş davet et', subLabel: 'Arkadaşlarını davet et' },
    { icon: 'globe-outline', label: 'Uygulama dili', subLabel: 'Türkçe (cihaz dili)' },
    { icon: 'help-circle-outline', label: 'Yardım', subLabel: 'Destek alın, geri bildirim gönderin' },
    { icon: 'share-outline', label: 'Uygulamayı Paylaş', subLabel: 'Arkadaşlarınla paylaş' },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchText) || item.subLabel.toLowerCase().includes(searchText)
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.label === 'Arkadaş davet et') {
          setBarcodeVisible(true);
        } else if (item.label === 'Uygulamayı Paylaş') {
          showAlert('App Shared', 'You have successfully shared the app.');
        } else {
          // Handle other menu items
        }
      }}
    >
      <Icon name={item.icon} size={28} color="#4CAF50" />
      <View style={styles.menuTextContainer}>
        <CustomText fontFamily={'pop'} style={styles.menuLabel}>{item.label}</CustomText>
        <CustomText fontFamily={'pop'} style={styles.menuSubLabel}>{item.subLabel}</CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={filteredMenuItems}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuTextContainer: {
    marginLeft: 15,
  },
  menuLabel: {
    fontSize: 18,
  },
  menuSubLabel: {
    fontSize: 14,
    color: '#888',
  },
});

export default MenuList;
