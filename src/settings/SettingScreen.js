import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import firestore from '@react-native-firebase/firestore';
import useDisableBackButton from "../hooks/useDisableBackButton";
import LogoutButton from "../components/LogoutButton";
import LoadingOverlay from "../components/LoadingOverlay";
import ProfileIconWithCamera from "../components/ProfileIconWithCamera";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
const { width } = Dimensions.get('window');

export default function SettingScreen() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  useDisableBackButton();

  useEffect(() => {
    if (user) {
      setLoading(true);
      const fetchUserData = async () => {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
        setLoading(false);
      };
      fetchUserData();
    }
  }, [user]);

  if (!userData) {
    return <LoadingOverlay visible={loading} />;
  }

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Home Page</Text>
        <ProfileIconWithCamera avatarUri={userData.avatar} />
        <Text style={styles.text}>Kullanıcı Adı: {userData.username}   </Text>
        <Text style={styles.text}>Hakkında: {userData.about} </Text>
        <Text style={styles.text}>Tarih: {userData.date} </Text>
        <LogoutButton />
        <Button text={'Chat Screen'} onPress={() => navigation.navigate('ChatScreen', { chatId: 'someChatId', userId: user.uid })} />
        <Button text={'Users List'} onPress={() => navigation.navigate('UsersList')} />
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
