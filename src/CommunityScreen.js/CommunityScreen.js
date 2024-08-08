import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from "react-native";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";

const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFLHz0vltSz4jyrQ5SmjyKiVAF-xjpuoHcCw&s';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
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

  const startChat = (userId) => {
    const chatId = [auth().currentUser.uid, userId].sort().join('_');
    navigation.navigate('ChatRoom', { chatId, userId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => startChat(item.id)}>
      <Image source={{ uri: item.avatar || defaultAvatar }} style={styles.avatar} />
      <View style={styles.messageContainer}>
        <Text style={styles.name}>{item.username}</Text>
        <Text style={item.state === 'online' ? styles.online : styles.offline}>
          {item.state === 'online' ? 'Online' : 'Offline'}
        </Text>
      </View>
      <Text style={styles.rankname}>{item.rank || ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Find Friends" textColor="black" showCameraIcon={false} 
      onSearch={setSearchText}  />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}
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
  },
  name: {
    fontSize: 16,
  },
  rankname: {
    fontSize: 16,
    color: 'blue',
  },
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
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
});
