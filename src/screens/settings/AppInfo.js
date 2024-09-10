import React, { useContext } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import Header from '../phoneLoginScreen/Header';
import CustomText from '../../components/CustomText';
import Button from '../../components/Button';
import { ThemeContext } from '../../context/ThemeContext';// Import ThemeContext

export default function AppInfo() {
  const { isDarkMode } = useContext(ThemeContext); // Use ThemeContext for theme
  const mitLicenseText = `
MIT License

Copyright (c) [2024] [Fatih Arslan]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  const showLicense = () => {
    Alert.alert('MIT License', mitLicenseText);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f7f7f7' }]}>
      <View style={{ margin: 50 }}>
        <Header fontSize={38} fontFamily="pop" text={'FlapTalk'} color="#00ae59" />
        <CustomText fontFamily="lato-bold" style={[styles.versionText, { color: isDarkMode ? 'white' : 'black' }]}>
          Version 1.0.1
        </CustomText>
        <CustomText fontFamily="lato-bold" style={[styles.copyrightText, { color: isDarkMode ? '#E0E0E0' : 'black' }]}>
          Copyright (c) [2024] [Fatih Arslan]
        </CustomText>
      </View>
      <Button text="License" onPress={showLicense} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
  },
  copyrightText: {
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    marginTop: 55,
  },
});
