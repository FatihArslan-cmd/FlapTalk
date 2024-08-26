import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SettingsHeader from './SettingsHeader';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

const FavoritesScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [friends, setFriends] = useState([]);

  const { width } = Dimensions.get('window');

  const handleBackPress = () => {
    navigation.goBack();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      try {
        const friendsSnapshot = await firestore()
          .collection('friends')
          .where('userId', '==', currentUser.uid)
          .get();

        const friendsList = await Promise.all(
          friendsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const friendSnapshot = await firestore()
              .collection('users')
              .doc(data.friendId)
              .get();
            return { id: data.friendId, ...friendSnapshot.data() };
          })
        );

        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleAddFavorite = async (friend) => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;
  
    try {
      await firestore()
        .collection('favorites')
        .add({
          userId: currentUser.uid,
          friendId: friend.id,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
  
      console.log(`${friend.username} favorilere eklendi!`);
    } catch (error) {
      console.error('Favori eklenirken hata oluştu:', error);
    } finally {
      toggleModal(); // Seçim sonrası modalı kapat
    }
  };
  

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => handleAddFavorite(item)}>
      <FastImage
        source={{ uri: item.avatar || defaultAvatar }}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.cover}
      />
      <CustomText fontFamily="pop" style={styles.friendName}>{item.username}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SettingsHeader title="Favorites" onBackPress={handleBackPress} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.favoritesHeader}>
          <FastImage
            source={require('../../assets/Wavy_Bus-22_Single-11.jpg')}
            resizeMode={FastImage.resizeMode.cover}
            style={[styles.favoritesImage, { width: width * 0.6, height: width * 0.4 }]}
          />
          <CustomText fontFamily="pop" style={styles.favoritesTitle}>Favorites</CustomText>
          <CustomText fontFamily="pop" style={styles.favoritesDescription}>
            Make it easy to find the people that matter most across FlapTalk.
          </CustomText>
        </View>
        <View style={styles.favoritesList}>
          <CustomText fontFamily="pop" style={styles.favoritesListTitle}>Favorites</CustomText>
          <TouchableOpacity style={styles.addFavoriteButton} onPress={toggleModal}>
            <Ionicons name="add-circle-outline" size={40} color="green" />
            <CustomText fontFamily="pop" style={styles.addFavoriteText}>Add favorite</CustomText>
          </TouchableOpacity>

          <Modal visible={isModalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              <CustomText fontFamily="pop" style={styles.modalTitle}>Select a Friend</CustomText>
              <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={renderFriendItem}
                ListEmptyComponent={<Text style={styles.emptyText}>No friends found</Text>}
              />
              <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                <CustomText fontFamily="pop" style={styles.closeButtonText}>Close</CustomText>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  favoritesHeader: { alignItems: 'center', marginVertical: 20 },
  favoritesImage: { borderRadius: 10 },
  favoritesTitle: { fontSize: 24, marginTop: 10, fontWeight: 'bold' },
  favoritesDescription: { fontSize: 16, textAlign: 'center', color: '#666', marginTop: 10 },
  favoritesList: { marginTop: 30 },
  favoritesListTitle: { fontSize: 22, fontWeight: 'bold' },
  addFavoriteButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  addFavoriteText: { fontSize: 18, color: 'green', marginLeft: 10 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  modalTitle: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  friendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  friendName: { fontSize: 18, marginLeft: 10 },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 33,
  },
  closeButton: { padding: 10, backgroundColor: 'red', borderRadius: 5, marginTop: 20 },
  closeButtonText: { textAlign: 'center', color: '#fff', fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#888', marginTop: 20 },
});

export default FavoritesScreen;
