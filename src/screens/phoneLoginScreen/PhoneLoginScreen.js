import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import PhoneInput from './PhoneInput';
import CodeInput from './CodeInput';
import LoadingOverlay from '../../components/LoadingOverlay';
import Button from '../../components/Button';
import AlertComponent from '../../components/AlertComponent';
import CustomText from '../../components/CustomText';
import useAlert from '../../hooks/useAlert'; // Import your custom hook
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

const { width, height } = Dimensions.get('window');

const PhoneLoginScreen = () => {
  const { t } = useTranslation(); // Initialize translation hook
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
      showAlert(t('Error'), t('Please enter your phone number.'));
      return;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      showAlert(t('Error'), t('Invalid phone number.'));
      return;
    }

    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(`+${callingCode}${phoneNumber}`);
      setConfirm(confirmation);
    } catch (error) {
      if (error.code === 'auth/too-many-requests') {
        showAlert(t('Error'), t('Requests from this device have been blocked due to unusual activity. Please try again later.'));
      } else {
        showAlert(t('Error'), t('Phone number verification failed.'));
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
        showAlert(t('Error'), t('Please enter the 6-digit verification code.'));
        return;
      }
      setLoading(true);
      const userCredential = await confirm.confirm(fullCode);
      setUserInfo(userCredential.user);
      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid, loginMethod: 'phone' });
    } catch (error) {
      if (error.code === 'auth/invalid-verification-code') {
        showAlert(t('Error'), t('Invalid verification code.'));
      } else if (error.code === 'auth/too-many-requests') {
        showAlert(t('Error'), t('Requests from this device have been blocked due to unusual activity. Please try again later.'));
      } else {
        showAlert(t('Error'), t('Verification code verification failed.'));
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
          <Header color='#00ad59' fontFamily='lato-bold' text={t("Enter your phone number")} />
          <CustomText fontFamily={'lato'} style={styles.infoText}>
            {t('We will send you a verification code.')}
            <CustomText fontFamily={'lato'} style={styles.linkText}>{t('What is my number?')}</CustomText>
          </CustomText>
          <PhoneInput
            countryCode={countryCode}
            callingCode={callingCode}
            setCountryCode={setCountryCode}
            setCallingCode={setCallingCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
          <Button onPress={signInWithPhoneNumber} text={t('Next')} />
        </>
      ) : (
        <>
          <Header color='#00ae59' text={t("Verifying your number")} />
          <CustomText fontFamily={'lato'} style={styles.verificationInfoText}>
            {t('Enter the code sent to {{number}} below.', { number: `+${callingCode} ${phoneNumber}` })}
          </CustomText>
          <CustomText fontFamily={'lato'} style={styles.wrongNumberText}>
            {t('Wrong number?')}
          </CustomText>
          <CodeInput code={code} setCode={setCode} inputRefs={inputRefs} />
          <Button margin={15} onPress={confirmCode} text={t('Confirm')} />
        </>
      )}
      <AlertComponent
        visible={isVisible}
        onClose={hideAlert}
        title={title}
        message={message}
        onConfirm={confirmAlert}
        confirmText={t('Okay')}
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
