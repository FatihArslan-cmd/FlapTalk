import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SettingsHeader from './SettingsHeader';
import CustomText from '../components/CustomText';
import FastImage from 'react-native-fast-image';
import AlertComponent from '../components/AlertComponent';

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

const FavoritesScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [friends, setFriends] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { width } = Dimensions.get('window');

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const toggleModal = useCallback(() => {
    setModalVisible((prev) => !prev);
  }, []);

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

  useEffect(() => {
    const fetchFavorites = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      try {
        const favoritesSnapshot = await firestore()
          .collection('favorites')
          .where('userId', '==', currentUser.uid)
          .get();

        const favoritesList = await Promise.all(
          favoritesSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const friendSnapshot = await firestore()
              .collection('users')
              .doc(data.friendId)
              .get();
            return { id: data.friendId, ...friendSnapshot.data() };
          })
        );

        setFavorites(favoritesList);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, []);

  const handleAddFavorite = useCallback(async (friend) => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const isAlreadyFavorite = favorites.some(favorite => favorite.id === friend.id);

    if (isAlreadyFavorite) {
      setAlertMessage(`${friend.username} is already in your favorites!`);
      setAlertVisible(true);
      toggleModal();
      return;
    }

    try {
      await firestore()
        .collection('favorites')
        .add({
          userId: currentUser.uid,
          friendId: friend.id,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });

      console.log(`${friend.username} has been added to favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      toggleModal();
    }
  }, [favorites, toggleModal]);

  const renderFriendItem = useMemo(() => ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => handleAddFavorite(item)}>
      <FastImage
        source={{ uri: item.avatar || defaultAvatar }}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.cover}
      />
      <CustomText fontFamily="pop" style={styles.friendName}>{item.username}</CustomText>
    </TouchableOpacity>
  ), [handleAddFavorite]);

  const renderFavoriteItem = useMemo(() => ({ item }) => (
    <View style={styles.friendItem}>
      <FastImage
        source={{ uri: item.avatar || defaultAvatar }}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.cover}
      />
      <CustomText fontFamily="pop" style={styles.friendName}>{item.username}</CustomText>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <SettingsHeader title="Favorites" onBackPress={handleBackPress} />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavoriteItem}
        ListHeaderComponent={() => (
          <View>
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
              <CustomText fontFamily="pop" style={styles.favoritesListTitle}>Your Favorites</CustomText>
            </View>
          </View>
        )}
        ListEmptyComponent={<CustomText fontFamily={'pop'} style={styles.emptyText}>No favorites found</CustomText>}
        ListFooterComponent={() => (
          <View>
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
        )}
        contentContainerStyle={styles.contentContainer}
      />
      <AlertComponent
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title="Already a Favorite"
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        confirmText="OK"
      />
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
  favoritesListTitle: { fontSize: 22, fontWeight: 'bold',marginVertical:20 },
  addFavoriteButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  addFavoriteText: { fontSize: 18, color: 'green', marginLeft: 10 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  modalTitle: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  friendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, },
  friendName: { fontSize: 18, marginLeft: 10 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'grey',
  },
  emptyText: { fontSize: 16, textAlign: 'center', color: '#666' },
  closeButton: { marginTop: 20, padding: 10, backgroundColor: '#2196F3', borderRadius: 5 },
  closeButtonText: { color: '#fff', textAlign: 'center' },
});

export default FavoritesScreen;
