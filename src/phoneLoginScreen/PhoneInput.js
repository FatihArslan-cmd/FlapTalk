import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import countryCodes from '../utils/countryCodes';
import ClearButton from '../components/renderClearButton';
import CountryFlag from 'react-native-country-flag';

const { width, height } = Dimensions.get('window');

const PhoneInput = ({ phoneNumber, setPhoneNumber }) => {
  const [localPhoneNumber, setLocalPhoneNumber] = useState(phoneNumber);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClearPhoneNumber = () => {
    setLocalPhoneNumber('');
    setPhoneNumber('');
  };

  const handleClearSearchQuery = () => {
    setSearchQuery('');
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setModalVisible(false);
  };

  const filteredCountryCodes = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity
        style={styles.countryPicker}
        onPress={() => setModalVisible(true)}
      >
        <CountryFlag isoCode={selectedCountry.isoCode} size={24} />
        <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
      </TouchableOpacity>

      <View style={styles.phoneNumberContainer}>
        <TextInput
          style={styles.phoneNumberInput}
          placeholder="Telefon numarası"
          keyboardType="phone-pad"
          value={localPhoneNumber}
          onChangeText={(text) => {
            setLocalPhoneNumber(text);
            setPhoneNumber(text);
          }}
        />
        <ClearButton value={localPhoneNumber} setValue={setLocalPhoneNumber} />
      </View>

      <Modal
         transparent={true}
         animationType="slide"
         visible={modalVisible}
         onRequestClose={() => {
           setModalVisible(false);
           setSearchQuery('');
         }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ülke arayın"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <ClearButton value={searchQuery} setValue={setSearchQuery} />
          </View>
          <FlatList
            data={filteredCountryCodes}
            keyExtractor={(item) => item.isoCode}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => handleSelectCountry(item)}
              >
                <CountryFlag isoCode={item.isoCode} size={24} />
                <Text style={styles.countryItemText}>{item.name}</Text>
                <Text style={styles.countryCodeText}>{item.code}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
    backgroundColor: 'white',
    elevation: 3,
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  countryCodeText: {
    fontSize: width * 0.04,
    marginLeft: 5,
  },
  phoneNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phoneNumberInput: {
    fontSize: width * 0.04,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    flex: 1,
    paddingHorizontal: 8,
  },
  clearButton: {
    marginLeft: 10,
  },
  clearButtonText: {
    fontSize: width * 0.04,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    width: width * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    fontSize: width * 0.04,
    padding: width * 0.02,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: width * 0.03,
    width: width * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  countryItemText: {
    fontSize: width * 0.04,
    flex: 1,
    marginLeft: width * 0.05,
  },
  countryCodeText: {
    fontSize: width * 0.04,
    marginLeft: 10,
  },
});

export default PhoneInput;
