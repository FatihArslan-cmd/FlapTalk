import React, { useRef, useState, useCallback, forwardRef } from 'react';
import { View, TouchableOpacity, Animated, PanResponder, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../components/CustomText';

const { height: screenHeight } = Dimensions.get('window');

const languages = [
  { label: 'Türkçe (cihaz dili)', translation: 'Türkçe (cihaz dili)' },
  { label: 'العربية', translation: 'Arapça' },
  { label: 'Afrikaans', translation: 'Afrikaanca' },
  { label: 'Shqip', translation: 'Arnavutça' },
  { label: 'አማርኛ', translation: 'Amharca' },
  { label: '中文', translation: 'Çince' },
  { label: 'English', translation: 'İngilizce' },
  { label: 'Français', translation: 'Fransızca' },
  { label: 'Deutsch', translation: 'Almanca' },
  { label: 'Español', translation: 'İspanyolca' },
  { label: 'हिन्दी', translation: 'Hintçe' },
  { label: 'Italiano', translation: 'İtalyanca' },
  { label: '日本語', translation: 'Japonca' },
  { label: '한국어', translation: 'Korece' },
  { label: 'Português', translation: 'Portekizce' },
  { label: 'Pусский', translation: 'Rusça' },
  { label: 'اردو', translation: 'Urduca' },
  { label: 'Ελληνικά', translation: 'Yunanca' },
  { label: 'עברית', translation: 'İbranice' },
  { label: 'ไทย', translation: 'Tayca' },
];

const LanguageItem = React.memo(({ language, isSelected, onPress }) => (
    <TouchableOpacity style={styles.languageItem} onPress={onPress}>
      <View>
        <CustomText fontFamily={'pop'} style={styles.languageLabel}>{language.label}</CustomText>
        <CustomText fontFamily={'pop'} style={styles.languageTranslation}>{language.translation}</CustomText>
      </View>
      <Ionicons
        name={isSelected ? 'ellipse' : 'ellipse-outline'}
        size={24}
        color={isSelected ? 'green' : 'black'}
      />
    </TouchableOpacity>
  ));
  
  const LanguageSelector = forwardRef((props, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Türkçe (cihaz dili)');
    const modalHeight = useRef(new Animated.Value(0)).current;
    const maxModalHeight = screenHeight * 0.75;
    const minModalHeight = screenHeight * 0.25;
  
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 20,
        onPanResponderMove: (_, gestureState) => {
          const newHeight = screenHeight - gestureState.moveY;
          if (newHeight >= minModalHeight && newHeight <= maxModalHeight) {
            modalHeight.setValue(newHeight);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100 && modalHeight._value <= minModalHeight + 50) {
            closeModal();
          } else if (gestureState.dy < -50 && modalHeight._value >= maxModalHeight * 0.6) {
            Animated.spring(modalHeight, {
              toValue: maxModalHeight,
              tension: 60,
              useNativeDriver: false,
            }).start();
          } else {
            Animated.spring(modalHeight, {
              toValue: screenHeight * 0.5,
              tension: 60,
              useNativeDriver: false,
            }).start();
          }
        },
      })
    ).current;
  
    const openModal = useCallback(() => {
        setModalVisible(true);  // First, make the modal visible
        
        // Delay the animation slightly to ensure modal is visible before starting animation
        setTimeout(() => {
          Animated.timing(modalHeight, {
            toValue: screenHeight * 0.5, // Desired height of the modal when opened
            duration: 300, // Duration of the animation
            useNativeDriver: false, // Set to false as we're animating height which isn't supported by native driver
          }).start();
        }, 100);  // 100ms delay to allow the modal to render first
      }, [modalHeight]);
    const closeModal = useCallback(() => {
      Animated.timing(modalHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setModalVisible(false);
      });
    }, [modalHeight]);
  
    const handleLanguageSelect = useCallback((language) => {
      setSelectedLanguage(language.label);
      closeModal();
    }, [closeModal]);
  
    React.useImperativeHandle(ref, () => ({
      openModal,
    }));
  
    return (
      <View style={styles.container}>
        {modalVisible && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              onPress={closeModal}
              activeOpacity={1}
            />
            <Animated.View
              style={[styles.modalContainer, { height: modalHeight }]}
              {...panResponder.panHandlers}
            >
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <CustomText fontFamily={'pop'} style={styles.modalTitle}>Uygulama Dili</CustomText>
              </View>
  
              <FlatList
                data={languages}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                  <LanguageItem
                    language={item}
                    isSelected={selectedLanguage === item.label}
                    onPress={() => handleLanguageSelect(item)}
                  />
                )}
                contentContainerStyle={styles.languageList}
              />
            </Animated.View>
          </>
        )}
      </View>
    );
  });
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      overflow: 'hidden',
    },
    modalHandle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 2.5,
      alignSelf: 'center',
      marginTop: 10,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    modalTitle: {
      fontSize: 20,
      marginLeft: 10,
    },
    languageList: {
      paddingBottom: 20,
      paddingHorizontal: 20,
    },
    languageItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    languageLabel: {
      fontSize: 16,
    },
    languageTranslation: {
      fontSize: 14,
      color: '#777',
    },
  });
  
  export default LanguageSelector;