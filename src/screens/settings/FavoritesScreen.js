import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SettingsHeader from './SettingsHeader';
import CustomText from '../../components/CustomText';
import FastImage from 'react-native-fast-image';
import AlertComponent from '../../components/AlertComponent';
import SkeletonPlaceholder from '../../components/Skeleton';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

const FavoritesScreen = ({ navigation }) => {
  const { isDarkMode } = useContext(ThemeContext); // Access dark mode state
  const [isModalVisible, setModalVisible] = useState(false);
  const [friends, setFriends] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const { t } = useTranslation();
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

      setLoading(true);
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
      } finally {
        setLoading(false);
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
      <CustomText fontFamily="pop" style={[styles.friendName , { color: isDarkMode ? 'white' : 'black'} ]}>{item.username}</CustomText>
    </TouchableOpacity>
  ), [handleAddFavorite]);

  const renderFavoriteItem = useMemo(() => ({ item, drag }) => (
    <TouchableOpacity
      style={styles.friendItem}
      onLongPress={drag}
      delayLongPress={200}
    >
      <FastImage
        source={{ uri: item.avatar || defaultAvatar }}
        style={styles.avatar}
        resizeMode={FastImage.resizeMode.cover}
      />
      <CustomText fontFamily="pop" style={styles.friendName}>{item.username}</CustomText>
    </TouchableOpacity>
  ), []);

  const renderSkeletonPlaceholder = useMemo(() => (
    <View style={styles.friendItem}>
      <SkeletonPlaceholder width={50} height={50} borderRadius={15} />
      <View style={styles.messageContainer}>
        <SkeletonPlaceholder width={100} height={20} borderRadius={4} />
        <SkeletonPlaceholder width={150} height={15} borderRadius={4} />
      </View>
    </View>
  ), [width]);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#fff' }]}>
      <SettingsHeader title={t('favorites')} onBackPress={handleBackPress} />
      <DraggableFlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setFavorites(data)}
        renderItem={renderFavoriteItem}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.favoritesHeader}>
              <FastImage
                source={require('../../../assets/Wavy_Bus-22_Single-11.jpg')}
                resizeMode={FastImage.resizeMode.cover}
                style={[styles.favoritesImage, { width: width * 0.6, height: width * 0.4 }]}
              />
              <CustomText fontFamily="pop" style={[styles.favoritesTitle, { color: isDarkMode ? 'white' : 'black' }]}>{t('favorites')}</CustomText>
              <CustomText fontFamily="pop" style={[styles.favoritesDescription, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {t('favoritesDescription')}
              </CustomText>
            </View>
            <View style={styles.favoritesList}>
              <CustomText fontFamily="pop" style={[styles.favoritesListTitle, { color: isDarkMode ? 'white' : 'black' }]}>{t('yourFavorites')}</CustomText>
            </View>
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            renderSkeletonPlaceholder
          ) : (
            <CustomText fontFamily="pop" style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#666' }]}>No favorites found</CustomText>
          )
        }
        ListFooterComponent={() => (
          <View>
            <TouchableOpacity style={styles.addFavoriteButton} onPress={toggleModal}>
              <Ionicons name="add-circle-outline" size={40} color="green" />
              <CustomText fontFamily="pop" style={[styles.addFavoriteText, { color: isDarkMode ? 'lightgreen' : 'green' }]}>{t('addFavorite')}</CustomText>
            </TouchableOpacity>
            <Modal visible={isModalVisible} animationType="slide">
              <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#333' : '#fff' }]}>
                <CustomText fontFamily="pop" style={[styles.modalTitle, { color: isDarkMode ? 'white' : 'black' }]}>{t('selectFriend')}</CustomText>
                <FlatList
                  data={friends}
                  keyExtractor={(item) => item.id}
                  renderItem={renderFriendItem}
                  ListEmptyComponent={<Text style={styles.emptyText}>{t('noFriendsFound')}</Text>}
                />
                <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                  <CustomText fontFamily="pop" style={styles.closeButtonText}>{t('close')}</CustomText>
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
  container: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  favoritesHeader: { alignItems: 'center', marginVertical: 20 },
  favoritesImage: { borderRadius: 10 },
  favoritesTitle: { fontSize: 24, marginTop: 10, fontWeight: 'bold' },
  favoritesDescription: { fontSize: 16, textAlign: 'center', marginTop: 10 },
  favoritesList: { marginTop: 30 },
  favoritesListTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 20 },
  addFavoriteButton: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  addFavoriteText: { fontSize: 18, marginLeft: 10 },
  modalContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  closeButton: { marginTop: 20, alignSelf: 'center' },
  closeButtonText: { fontSize: 18, color: 'red' },
  friendItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  avatar: { width: 55, height: 55, borderRadius: 55, marginRight: 10 },
  friendName: { fontSize: 20, fontWeight: 'bold' },
  emptyText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  messageContainer: {
    flex: 1,
    marginLeft: 10,
  },
});

export default FavoritesScreen;
