import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutButton() {
    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to get the current route
    const [userInfo, setUserInfo] = useState(route.params?.userInfo);
    const [loginMethod, setLoginMethod] = useState(route.params?.loginMethod);

    useEffect(() => {
        const getLoginMethod = async () => {
            if (!loginMethod) {
                const storedLoginMethod = await AsyncStorage.getItem('loginMethod');
                setLoginMethod(storedLoginMethod);
            }
        };

        getLoginMethod();
    }, [loginMethod]);

    const handleLogout = async () => {
        try {
            if (loginMethod === 'phone') {
                await auth().signOut();
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginMethod'); // Remove loginMethod from AsyncStorage

                navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                });
            } else if (loginMethod === 'google') {
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('loginMethod'); // Remove loginMethod from AsyncStorage

                setUserInfo(null);
                navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                });
            } else {
                console.log("Unknown login method");
            }
        } catch (error) {
            console.log("Error during logout:", error);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
