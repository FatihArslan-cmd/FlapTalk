import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import Button from "./Button";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutButton() {
    const navigation = useNavigation();
    const route = useRoute();
    const [loginMethod, setLoginMethod] = useState(null);
    const [userInfo, setUserInfo] = useState(route.params?.userInfo);

    useEffect(() => {
        const fetchLoginMethod = async () => {
            const method = await AsyncStorage.getItem('loginMethod');
            setLoginMethod(method);
        };

        fetchLoginMethod();
    }, []);

    const handleLogout = async () => {
        try {
            if (loginMethod === 'phone' || loginMethod === 'email') {
                await auth().signOut();
            } else if (loginMethod === 'google') {
                await GoogleSignin.configure({});
                await GoogleSignin.signOut();
                setUserInfo(null);
            } else {
                console.log("Unknown login method");
            }
        } catch (error) {
            if (error.code === 'auth/no-current-user') {
                console.log("No user currently signed in.");
            } else {
                console.log("Error during logout:", error);
            }
        } finally {
            navigation.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
            });
        }
    };

    return (
        <View style={styles.container}>
            <Button onPress={handleLogout} text={'Logout'} />
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
});
