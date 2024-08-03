import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useDisableBackButton from "./hooks/useDisableBackButton";
import LogoutButton from "./components/LogoutButton";
export default function AppHomePage({ route }) {
  const navigation = useNavigation();

  return (
      <View style={styles.container}>
          <Text style={styles.header}>Home Page</Text>
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
