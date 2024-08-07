import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, RefreshControl } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import CustomText from "../components/CustomText";
import AppHeader from "../components/AppHeader";
import { UserStatusContext } from '../context/UserStatusContext';

const defaultAvatar = 'data:image/png;base64,...'; // Add your default avatar URI here

export default function CommunityScreen() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  const status = useContext(UserStatusContext);
  const currentUserId = auth().currentUser.uid;

  const fetchUsers = async () => {
    setRefreshing(true);
    const usersCollection = await firestore().collection('users').get();
    const fetchedUsers = usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const filteredUsers = fetchedUsers.filter(user => user.id !== currentUserId);
    const sortedUsers = filteredUsers.sort((a, b) => (a.state === 'online' ? -1 : 1));
    setUsers(sortedUsers);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  useEffect(() => {
    const filtered = users.filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredUsers(filtered);
  }, [searchText, users]);

  const startChat = async (userId) => {
    const chatId = [auth().currentUser.uid, userId].sort().join('_');
    navigation.navigate('ChatScreen', { chatId, userId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => startChat(item.id)}>
      <Image source={{ uri: item.avatar || defaultAvatar }} style={styles.avatar} />
      <View style={styles.messageContainer}>
        <CustomText fontFamily={'pop'} style={styles.name}>{item.username}</CustomText>
        <Text style={item.state === 'online' ? styles.online : styles.offline}>
          {item.state === 'online' ? 'Online' : 'Offline'}
        </Text>
      </View>
      {item.rank ? (
        <CustomText fontFamily={'pop'} style={styles.rankname}>{item.rank}</CustomText>
      ) : (
        <Text style={styles.rankname}></Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Find Friends" textColor="black" showCameraIcon={false} onSearch={setSearchText} />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
        }
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
});
