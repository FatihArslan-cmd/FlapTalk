import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
     
      <Text style={styles.title}>WhatsApp'a Hoş Geldiniz</Text>
      <Text style={styles.subtitle}>
        <Text style={styles.link}>Gizlilik İlkemizi</Text> okuyun.{' '}
        <Text style={styles.link}>Hizmet Koşulları'nı</Text> kabul etmek için "Kabul et ve devam et" seçeneğine dokunun.
      </Text>
      <TouchableOpacity style={styles.languageButton}>
        <Text style={styles.languageButtonText}>Türkçe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainButton}>
        <Text style={styles.mainButtonText}>Kabul et ve devam et</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  link: {
    color: 'blue',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F0F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  languageButtonText: {
    fontSize: 16,
    color: 'black',
  },
  mainButton: {
    backgroundColor: '#25D366',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '90%',
  },
  mainButtonText: {
    color: 'white',
    fontSize: 16,
  },
});