import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "./hooks/useDisableBackButton";
import LogoutButton from "./components/LogoutButton";
import LoadingOverlay from "./components/LoadingOverlay";
import SafeAreaWrapper from "./components/SafeAreaWrapper";
import ProfileIconWithCamera from "./components/ProfileIconWithCamera";
import UsersList from "./home/UserList";
const { width, height } = Dimensions.get('window');

export default function AppHomePage({ route }) {
  const { uid } = route.params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useDisableBackButton();

  useEffect(() => {
    setLoading(true)
    const fetchUserData = async () => {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        setUserData(userDoc.data());
      }
      setLoading(false)
    };

    fetchUserData();
  }, [uid]);

  if (!userData) {
    return (
      <LoadingOverlay visible={loading} />
    );
  }

  return (
    <SafeAreaWrapper>
    <View style={styles.container}>
      <Text style={styles.header}>Home Page </Text>
      <ProfileIconWithCamera         avatarUri={userData.avatar}/>
      <Text style={styles.text}>Kullanıcı Adı: {userData.username} o</Text>
      <Text style={styles.text}>Hakkında: {userData.about} </Text>
      <Text style={styles.text}>Tarih: {userData.date} </Text>
      <LogoutButton route={route} />
      
    </View>
    </SafeAreaWrapper>
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
