import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Bounce } from 'react-native-animated-spinkit';
import AlertComponent from './components/AlertComponent'; // AlertComponent.js dosyasının yolu

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
      navigation.navigate('AppHomePage', { userInfo: userCredential.user });
    } catch (error) {
      showAlert('Hata', 'Geçersiz doğrulama kodu.');
    }
  }

  const handleChangeText = (index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <Bounce size={48} color="#0d0d0d" />
        </View>
      )}
      {!confirm ? (
        <>
          <Text style={styles.headerText}>Telefon numaranızı girin</Text>
          <Text style={styles.infoText}>
            Sana doğrulama kodu göndereceğiz.
            <Text style={styles.linkText}> Numaram nedir? </Text>
          </Text>
          <View style={styles.inputContainer}>
            <CountryPicker
              countryCode={countryCode}
              withFilter
              withFlag
              withCallingCode
              withEmoji
              onSelect={(country) => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
              containerButtonStyle={styles.countryPicker}
            />
            <View style={styles.callingCodeContainer}>
              <Text style={styles.plusSign}>+</Text>
              <TextInput
                style={styles.callingCodeInput}
                value={callingCode}
                onChangeText={setCallingCode}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
            <TextInput
              style={styles.phoneNumberInput}
              placeholder="Telefon numarası"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={signInWithPhoneNumber}>
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.verificationText}>Numaranız Doğrulanıyor</Text>
          <Text style={styles.verificationInfoText}>+{callingCode} {phoneNumber} numaralı telefona gönderilen kodu aşağıdaki bölmeye yazınız.</Text>
          <Text style={styles.wrongNumberText}>Numara yanlış mı?</Text>
          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <View key={index} style={styles.circle}>
                <TextInput
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(value) => handleChangeText(index, value)}
                  value={digit}
                />
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>Onayla </Text>
          </TouchableOpacity>
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
  headerText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  infoText: {
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom: height * 0.05,
  },
  linkText: {
    color: '#0084ff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: height * 0.05,
  },
  countryPicker: {
    marginRight: 10,
  },
  callingCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
    paddingVertical: 5.5,
    
  },
  plusSign: {
    fontSize: width * 0.04,
    marginRight: 5,
  },
  callingCodeInput: {
    fontSize: width * 0.04,
    width: width * 0.1,
    textAlign: 'center',
  },
  phoneNumberInput: {
    fontSize: width * 0.04,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    flex: 1,
    paddingHorizontal: 8,
  },
  verificationText: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#3eb09f'
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
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.05,
  },
  circle: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#075E54',
    paddingVertical: height * 0.02,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PhoneLoginScreen;
