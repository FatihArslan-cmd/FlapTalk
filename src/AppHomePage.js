import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import AppHeader from './components/AppHeader';
import CustomText from './components/CustomText';
import SafeAreaWrapper from './components/SafeAreaWrapper';
const data = [
  { id: '1', name: 'İlker Samut', message: 'ama ona göre para alırım', time: '19:33', avatar: require('../assets/avatars/Untitled (11).jpg') },
  { id: '2', name: 'Gurup Gurup Gurup', message: 'Şu mesaja 😢 ifadesini bıraktınız:', time: 'Dün', avatar: require('../assets/avatars/Untitled (10).jpg') },
  { id: '3', name: 'M.Ali', message: 'Büyük ihtimal 👍', time: '5.08.2024',avatar: require('../assets/avatars/Untitled (9).jpg')  },
  { id: '4', name: 'Filiz', message: 'https://youtube.com/shorts/Qr8-eYtA', time: '3.08.2024',avatar: require('../assets/avatars/Untitled (8).jpg') },
  { id: '5', name: 'Abla', message: 'Offf', time: '2.08.2024',avatar: require('../assets/avatars/Untitled (7).jpg')  },
  { id: '7', name: 'Kafdir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024',avatar: require('../assets/avatars/Untitled (6).jpg') },
  { id: '8', name: 'Kadirs Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024',avatar: require('../assets/avatars/Untitled (5).jpg') },
  { id: '9', name: 'Kadffir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024',avatar: require('../assets/avatars/Untitled (4).jpg') },
  { id: '10', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', avatar: require('../assets/avatars/Untitled (3).jpg')},
  { id: '11', name: 'Kagdidr Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024',avatar: require('../assets/avatars/Untitled (2).jpg') },
  { id: '12', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024',avatar: require('../assets/avatars/Untitled (1).jpg') },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },
  { id: '6', name: 'Kadir Emir', message: 'Şu mesaja 😂 ifadesini bıraktınız:', time: '31.07.2024', },

];

export default function AppHomePage() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.messageContainer}>
        <CustomText fontFamily={'pop'} style={styles.name}>{item.name}</CustomText>
        <CustomText fontFamily={'lato-bold'} style={styles.message}>{item.message}</CustomText>
      </View>
      <CustomText fontFamily={'lato-bold'} style={styles.time}>{item.time}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="FlapTalk" textColor="#00ae59" showCameraIcon={true} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
  },
  message: {
    color: '#888',
  },
  time: {
    color: '#888',
    fontSize: 12,
  },
});