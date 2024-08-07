import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from "@react-navigation/native";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await firestore().collection('users').get();
      setUsers(usersCollection.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchUsers();
  }, []);

  const startChat = async (userId) => {
    const chatId = [auth().currentUser.uid, userId].sort().join('_');
    navigation.navigate('ChatScreen', { chatId, userId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => startChat(item.id)}>
            <Text style={styles.user}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  user: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
