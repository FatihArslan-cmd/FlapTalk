import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import Button from "./Button";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutButton() {
    const navigation = useNavigation();
    const route = useRoute(); // Use useRoute to get the current route
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
            if (loginMethod === 'phone') {
                await auth().signOut();
                navigation.reset({
                    index: 0,
                    routes: [{ name: "LoginScreen" }],
                });
            } else if (loginMethod === 'google') {
                GoogleSignin.configure({});
                await GoogleSignin.revokeAccess();
                await GoogleSignin.signOut();
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
