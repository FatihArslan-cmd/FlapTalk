import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "./hooks/useDisableBackButton";
import LogoutButton from "./components/LogoutButton";

const { width, height } = Dimensions.get('window');

export default function AppHomePage({ route }) {
  const { uid } = route.params;
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  useDisableBackButton();

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        setUserData(userDoc.data());
      }
    };

    fetchUserData();
  }, [uid]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home Page</Text>
      {userData.avatar && (
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
      )}
      <Text style={styles.text}>Kullanıcı Adı: {userData.username} </Text>
      <Text style={styles.text}>Hakkında: {userData.about} </Text>
      <Text style={styles.text}>Tarih: {userData.date} </Text>
      <LogoutButton route={route} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  avatar: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
