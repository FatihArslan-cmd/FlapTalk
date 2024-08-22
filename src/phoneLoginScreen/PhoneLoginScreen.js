import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import PhoneInput from './PhoneInput';
import CodeInput from './CodeInput';
import LoadingOverlay from '../components/LoadingOverlay';
import Button from '../components/Button';
import AlertComponent from '../components/AlertComponent';
import CustomText from '../components/CustomText';
import useAlert from '../hooks/useAlert'; // Import your custom hook

const { width, height } = Dimensions.get('window');

const PhoneLoginScreen = () => {
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState(new Array(6).fill(''));
  const [countryCode, setCountryCode] = useState('US');
  const [callingCode, setCallingCode] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const { isVisible, title, message, showAlert, hideAlert, confirmAlert } = useAlert(); // Use the custom hook

  function onAuthStateChanged(user) {
    if (user) {
      // handle user state changes if necessary
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signInWithPhoneNumber = async () => {
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
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        showAlert('Hata', 'Bu cihazdan yapılan istekler alışılmadık bir etkinlik nedeniyle engellendi. Lütfen daha sonra tekrar deneyin.');
      } else {
        showAlert('Hata', 'Telefon numarası doğrulaması başarısız.');
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    try {
      const fullCode = code.join('');
      if (fullCode.length !== 6) {
        showAlert('Hata', 'Lütfen 6 haneli doğrulama kodunu girin.');
        return;
      }
      setLoading(true);
      const userCredential = await confirm.confirm(fullCode);
      setUserInfo(userCredential.user);
      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid, loginMethod: 'phone' });
    } catch (error) {
      if (error.code === 'auth/invalid-verification-code') {
        showAlert('Hata', 'Geçersiz doğrulama kodu.');
      } else if (error.code === 'auth/too-many-requests') {
        showAlert('Hata', 'Bu cihazdan yapılan istekler alışılmadık bir etkinlik nedeniyle engellendi. Lütfen daha sonra tekrar deneyin.');
      } else {
        showAlert('Hata', 'Doğrulama kodu doğrulaması başarısız.');
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} />
      {!confirm ? (
        <>
          <Header color='#00ad59' fontFamily='lato-bold' text="Telefon numaranızı girin" />
          <CustomText fontFamily={'lato'} style={styles.infoText}>
            Sana doğrulama kodu göndereceğiz.
            <CustomText fontFamily={'lato'} style={styles.linkText}> Numaram nedir? </CustomText>
          </CustomText>
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
          <Header color='#00ae59' text="Numaranız Doğrulanıyor"/>
          <CustomText fontFamily={'lato'} style={styles.verificationInfoText}>
            +{callingCode} {phoneNumber} numaralı telefona gönderilen kodu aşağıdaki bölmeye yazınız.
          </CustomText>
          <CustomText fontFamily={'lato'} style={styles.wrongNumberText}>
            Numara yanlış mı?
          </CustomText>
          <CodeInput code={code} setCode={setCode} inputRefs={inputRefs} />
          <Button margin={15} onPress={confirmCode} text="Onayla " />
        </>
      )}
      <AlertComponent
        visible={isVisible}
        onClose={hideAlert}
        title={title}
        message={message}
        onConfirm={confirmAlert}
        confirmText="Tamam"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'#FAF9F6',
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
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
    textAlign: 'center',
  },
  wrongNumberText: {
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: '#5eb2ce',
  },
});

export default PhoneLoginScreen;
