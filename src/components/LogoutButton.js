import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-community/google-signin';

export default function LogoutButton() {
    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to get the current route
    const [userInfo, setUserInfo] = useState(route.params?.userInfo);

    const logOut = async () => {
        try {
            if (userInfo) {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                setUserInfo(null);
                navigation.navigate('LoginScreen');
            } else {
                console.log("No user is signed in");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={logOut}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
