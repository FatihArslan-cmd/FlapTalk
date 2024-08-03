import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Alert } from 'react-native';

const { width } = Dimensions.get('window');

const VerificationScreen = () => {
  const [code, setCode] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    let newCode = code.split('');
    newCode[index] = text;
    setCode(newCode.join(''));
    
    if (newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = (code) => {
    // Replace with actual submission logic
    Alert.alert('Code Submitted', `Code: ${code}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Numaranız Doğrulanıyor </Text>
      <Text style={styles.subtitle}>+90 541 411 96 54 numaralı telefona gönderilen kodu aşağıdaki bölmeye yazınız.</Text>
      <Text style={styles.asubtitle}>Numara yanlış mı? </Text>
      <View style={styles.inputContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <View key={index} style={styles.circle}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={code[index] || ''}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
            <View style={styles.underline} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color:'#3eb09f'
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  asubtitle: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color:'#5eb2ce'

  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
  },
  circle: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'black',
  },
  input: {
    textAlign: 'center',
    fontSize: 24,
  },
});

export default VerificationScreen;
