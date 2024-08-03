import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import firestore from "@react-native-firebase/firestore";

const ProfileScreen = ({ route, navigation }) => {
  const { uid } = route.params;
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [status, setStatus] = useState('');

 
  const saveProfile = async () => {
    try {
      await firestore().collection('users').doc(uid).set({
        name,
        surname,
        status,
      });
      navigation.navigate("AppHomePage");
    } catch (error) {
      Alert.alert("Error", "There was a problem saving your details. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Surname"
        value={surname}
        onChangeText={setSurname}
      />
      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />
      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
};

export default ProfileScreen;
