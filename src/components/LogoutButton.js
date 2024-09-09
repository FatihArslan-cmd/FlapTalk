import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomText from "./CustomText";
import { useTranslation } from "react-i18next";

export default function LogoutButton() {
    const navigation = useNavigation();
    const route = useRoute();
    const [loginMethod, setLoginMethod] = useState(null);
    const { t } = useTranslation();

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
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Icon name="log-out-outline" size={28} color="#f44336" />
            <View style={styles.menuTextContainer}>
                <CustomText fontFamily={'pop'} style={styles.menuLabel}>{t('Exit')}</CustomText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingHorizontal: 20,
    },
    menuTextContainer: {
        marginLeft: 20,
    },
    menuLabel: {
        fontSize: 16,
        color: '#333',
    },
});
