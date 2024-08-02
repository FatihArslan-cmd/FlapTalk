import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PhoneLoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState(null);
    const navigation = useNavigation();

    const signInWithPhoneNumber = async () => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch (error) {
            Alert.alert("Error", "Failed to send OTP. Please check your phone number.");
            console.log(error);
        }
    };

    const confirmCode = async () => {
        try {
            const userCredentials = await confirm.confirm(code);
            const user = userCredentials.user;

            const userDocument = await firestore()
                .collection('users')
                .doc(user.uid)
                .get();

            if (userDocument.exists) {
                navigation.navigate("Dashboard");
            } else {
                navigation.navigate("Details", { uid: user.uid });
            }
        } catch (error) {
            Alert.alert("Error", "Invalid code. Please try again.");
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Login</Text>
            {!confirm ? (
                <>
                    <Text>Enter your phone number</Text>
                    <TextInput
                        placeholder='Number with country code'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        placeholder='Confirm code'
                        onChangeText={setCode}
                        value={code}
                        keyboardType='number-pad'
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.button} onPress={confirmCode}>
                        <Text style={styles.buttonText}>Confirm Code</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
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

export default PhoneLoginScreen;
