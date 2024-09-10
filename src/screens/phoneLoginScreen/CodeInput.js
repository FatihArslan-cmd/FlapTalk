import React, { useCallback } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CodeInput = ({ code, setCode, inputRefs }) => {
  const handleChangeText = useCallback((index, value) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }, [code, setCode, inputRefs]);

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace') {
      if (index > 0) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <View style={styles.codeInputContainer}>
      {code.map((digit, index) => (
        <View key={index} style={styles.circle}>
          <TextInput
            ref={(el) => (inputRefs.current[index] = el)}
            style={styles.input}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(value) => handleChangeText(index, value)}
            onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
            value={digit}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});

export default CodeInput;
