import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../config'
import firebase from 'firebase/compat/app'
import { TextInput } from 'react-native-web'
const Otp = () => {
 
    const [phoneNumber,setPhoneNumber]= useState('');
    const [code,setCode]= useState('');
    const [verificationId,setVerificationId]= useState(null);
    const recaptchaVerifier = useRef(null)

    const sentVerification = () =>
    {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        phoneProvider
        .verifyPhoneNumber(phoneNumber,recaptchaVerifier.current)
        .then(verificationId);
        setPhoneNumber('')
    };

    const confirmCode = () =>
    {
        const credential =firebase.auth.PhoneAuthProvider.credential
        (verificationId,code);
        firebase.auth().signInWithCredential(credential)
        .then( () =>
        {
             setCode('');
        }
        )
        .catch((error) => { 
            //show alert
         })
         Alert.alert(
            'Alert',
         );

    }

    return (
        <View>
        <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        />
        <Text>Login</Text>
        <TextInput
        placeholder = 'number with country code'
        onChangeText={setPhoneNumber}
        keyboardType='phone-pad'
        autoCompleteType='tel'
        />
        <TouchableOpacity  onPress={sentVerification}>
            <Text>Send OTP</Text>
        </TouchableOpacity>
        <TextInput
        placeholder = 'confirm code'
        onChangeText={setCode}
        keyboardType='number-pad'
        />
         <TouchableOpacity  onPress={confirmCode}>
            <Text>Send OTP</Text>
        </TouchableOpacity>
        </View>
    )
}

export default Otp