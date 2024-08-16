import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from "react-native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "../hooks/useDisableBackButton";
import LogoutButton from "../components/LogoutButton";
import LoadingOverlay from "../components/LoadingOverlay";
import ProfileIconWithCamera from "../components/ProfileIconWithCamera";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function SettingScreen() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useDisableBackButton();

  useEffect(() => {
    if (user) {
      setLoading(true);
      const fetchUserData = async () => {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [user]);

  if (!userData) {
    return <LoadingOverlay visible={loading} />;
  }

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
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <ProfileIconWithCamera avatarUri={userData.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.about}>{userData.about}</Text>
          </View>
        </View>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Icon name={item.icon} size={24} color="#4CAF50" />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSubLabel}>{item.subLabel}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <LogoutButton />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    marginLeft: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  about: {
    fontSize: 14,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuTextContainer: {
    marginLeft: 20,
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
  menuSubLabel: {
    fontSize: 12,
    color: '#888',
  },
});

