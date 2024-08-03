import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import PhoneInput from './PhoneInput';
import CodeInput from './CodeInput';
import LoadingOverlay from '../components/LoadingOverlay';
import Button from '../components/Button';
import AlertComponent from '../components/AlertComponent';

const { width, height } = Dimensions.get('window');

const PhoneLoginScreen = () => {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState(new Array(6).fill(''));
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const inputRefs = useRef([]);
  const navigation = useNavigation();

  function onAuthStateChanged(user) {
    if (user) {
      // handle user state changes if necessary
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  const handleConfirmAlert = () => {
    setAlertVisible(false);
    // Additional confirmation logic if needed
  };

  async function signInWithPhoneNumber() {
    if (phoneNumber.trim() === '') {
      showAlert('Hata', 'Lütfen telefon numaranızı girin.');
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      showAlert('Hata', 'Geçersiz telefon numarası.');
      return;
    }

    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(`+${callingCode}${phoneNumber}`);
      setConfirm(confirmation);
      setLoading(false);
    } catch (error) {
      showAlert('Hata', 'Telefon numarası doğrulaması başarısız.');
      setLoading(false);
    }
  }

  async function confirmCode() {
    try {
      const fullCode = code.join('');
      if (fullCode.length !== 6) {
        showAlert('Hata', 'Lütfen 6 haneli doğrulama kodunu girin.');
        return;
      }
      setLoading(true);
      const userCredential = await confirm.confirm(fullCode);
      setUserInfo(userCredential.user);
      setLoading(false);
      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid }); // Yönlendirme
    } catch (error) {
      showAlert('Hata', 'Geçersiz doğrulama kodu.');
      setLoading(false);
    }
  }
  

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      {!confirm ? (
        <>
          <Header text="Telefon numaranızı girin" />
          <Text style={styles.infoText}>
            Sana doğrulama kodu göndereceğiz.
            <Text style={styles.linkText}> Numaram nedir? </Text>
          </Text>
          <PhoneInput
            countryCode={countryCode}
            callingCode={callingCode}
            setCountryCode={setCountryCode}
            setCallingCode={setCallingCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
          <Button onPress={signInWithPhoneNumber} text="İleri " />
        </>
      ) : (
        <>
          <Header text="Numaranız Doğrulanıyor" />
          <Text style={styles.verificationInfoText}>+{callingCode} {phoneNumber} numaralı telefona gönderilen kodu aşağıdaki bölmeye yazınız. </Text>
          <Text style={styles.wrongNumberText}>Numara yanlış mı? </Text>
          <CodeInput code={code} setCode={setCode} inputRefs={inputRefs} />
          <Button margin={15} onPress={confirmCode} text="Onayla " />
        </>
      )}
      <AlertComponent
        visible={alertVisible}
        onClose={handleCloseAlert}
        title={alertTitle}
        message={alertMessage}
        onConfirm={handleConfirmAlert}
        confirmText="Tamam"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  linkText: {
    color: '#0084ff',
  },
  verificationInfoText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  wrongNumberText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#5eb2ce'
  },
});

export default PhoneLoginScreen;