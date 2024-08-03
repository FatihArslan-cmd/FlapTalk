import React from 'react';
import { View, TextInput, StyleSheet, Dimensions,Text } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const { width, height } = Dimensions.get('window');

const PhoneInput = ({ countryCode, callingCode, setCountryCode, setCallingCode, phoneNumber, setPhoneNumber }) => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default PhoneInput;
