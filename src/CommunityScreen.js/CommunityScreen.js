import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import AppHeader from "../components/AppHeader";
import AlertComponent from "../components/AlertComponent";
import { calculateMembershipDuration } from "../utils/calculateMembershipDuration ";
const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const fetchUsers = async () => {
    try {
      const currentUser = auth().currentUser.uid;
      const usersCollection = await firestore().collection('users').get();
      const fetchedUsers = usersCollection.docs
        .map(doc => ({ ...doc.data(), id: doc.id }))
        .filter(user => user.id !== currentUser)
        .sort((a, b) => (b.state === 'online') - (a.state === 'online'));

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers().then(() => setRefreshing(false));
  };

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const addFriend = async (friendId) => {
    try {
      const currentUser = auth().currentUser.uid;

      // Check if the friend is already added
      const friendsQuerySnapshot = await firestore()
        .collection('friends')
        .where('userId', '==', currentUser)
        .where('friendId', '==', friendId)
        .get();

      if (!friendsQuerySnapshot.empty) {
        setAlertMessage('This user is already in your friend list.');
        setAlertVisible(true);
        return;
      }

      // Add friend to Firestore
      await firestore().collection('friends').add({
        userId: currentUser,
        friendId,
        avatar: filteredUsers.find(user => user.id === friendId).avatar || defaultAvatar,
        time: new Date().toISOString(),
      });

      setAlertMessage('This user has been added to your friend list.');
      setAlertVisible(true);
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const blockUser = async (userId) => {
    setAlertMessage('This user has been blocked.');
    setAlertVisible(true);
  };

  const renderRightActions = (item) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={[styles.actionButton, styles.addAction]} onPress={() => addFriend(item.id)}>
        <Icon name="person-add-outline" size={24} color="#fff" />
        <Text style={styles.actionText}>Add Friend </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionButton, styles.blockAction]} onPress={() => blockUser(item.id)}>
        <Icon name="ban-outline" size={24} color="#fff" />
        <Text style={styles.actionText}>Block User </Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.item}>
        <Image source={{ uri: item.avatar || defaultAvatar }} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.username}</Text>
            <Text style={styles.date}>{`Member since ${calculateMembershipDuration(item.date)} `}</Text>
          </View>
          <Text style={item.state === 'online' ? styles.online : styles.offline}>
            {item.state === 'online' ? 'Online' : 'Offline'}
          </Text>
        </View>
        <Text style={styles.rankname}>{item.rank || ''}</Text>
      </View>
    </Swipeable>
  );
  


  return (
    <View style={styles.container}>
      <AppHeader title="Find Friends" textColor="black" showCameraIcon={false} onSearch={setSearchText} />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found </Text>
          </View>
        )}
      />
      <AlertComponent
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title="Alert"
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
        confirmText="OK"
      />
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
      justifyContent: 'center',
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      flex: 1,
      marginRight: 10,
    },
    date: {
      fontSize: 14,
      color: '#888',
    },
    rankname: {
      fontSize: 16,
      color: 'blue',
    },
    online: {
      color: 'green',
      marginTop: 5,
    },
    offline: {
      color: 'red',
      marginTop: 5,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      color: '#888',
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    actionButton: {
      padding: 18,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addAction: {
      backgroundColor: '#4CAF50',
    },
    blockAction: {
      backgroundColor: '#F44336',
    },
    actionText: {
      color: '#fff',
      fontSize: 12,
    },
  });
  
