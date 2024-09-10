import React, { useRef, useState, useCallback, forwardRef, useContext } from 'react';
import { View,ScrollView, TouchableOpacity, Animated, PanResponder, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/CustomText';
import LanguageContext from '../../context/LanguageContext';
import { ThemeContext } from '../../context/ThemeContext'; // Import ThemeContext

const { height: screenHeight } = Dimensions.get('window');

const languages = [
  { label: 'English', code: 'en', translation: 'İngilizce' },
  { label: 'Türkçe (cihaz dili)', code: 'tr', translation: 'Türkçe (cihaz dili)' },
  { label: 'العربية', code: 'ar', translation: 'Arapça' },
  { label: 'Deutsch', code: 'de', translation: 'Almanca' },
  { label: 'Ελληνικά', code: 'el', translation: 'Yunanca' },
  { label: 'Español', code: 'es', translation: 'İspanyolca' },
  { label: 'Français', code: 'fr', translation: 'Fransızca' },
  { label: 'Pусский', code: 'ru', translation: 'Rusça' },
  { label: '中文', code: 'zh', translation: 'Çince' },
];

const LanguageItem = React.memo(({ language, isSelected, onPress, isDarkMode }) => (
  <TouchableOpacity style={styles.languageItem} onPress={onPress}>
    <View>
      <CustomText fontFamily={'pop'} style={[styles.languageLabel, { color: isDarkMode ? 'white' : 'black' }]}>
        {language.label}
      </CustomText>
      <CustomText fontFamily={'pop'} style={[styles.languageTranslation, { color: isDarkMode ? '#aaa' : '#777' }]}>
        {language.translation}
      </CustomText>
    </View>
    <Ionicons
      name={isSelected ? 'ellipse' : 'ellipse-outline'}
      size={24}
      color={isSelected ? 'green' : isDarkMode ? 'white' : 'black'}
    />
  </TouchableOpacity>
));

const LanguageSelector = forwardRef((props, ref) => {
  const { currentLanguage, changeLanguage } = useContext(LanguageContext);
  const { isDarkMode } = useContext(ThemeContext); // Access ThemeContext
  const [modalVisible, setModalVisible] = useState(false);
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
    setModalVisible(true);
    setTimeout(() => {
      Animated.timing(modalHeight, {
        toValue: screenHeight * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, 100);
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

  const handleLanguageSelect = useCallback(
    (language) => {
      changeLanguage(language.code);
      closeModal();
    },
    [changeLanguage, closeModal]
  );

  React.useImperativeHandle(ref, () => ({
    openModal,
  }));

  return (
    <View style={styles.container}>
      {modalVisible && (
        <>
          <TouchableOpacity style={styles.overlay} onPress={closeModal} activeOpacity={1} />
          <Animated.View
            style={[
              styles.modalContainer,
              { height: modalHeight, backgroundColor: isDarkMode ? '#333' : 'white' },
            ]}
            {...panResponder.panHandlers}
          >
            <ScrollView style={styles.modalHandle} />
            <View style={[styles.modalHeader, { backgroundColor: isDarkMode ? '#333' : 'white' }]}>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? 'white' : 'black'} />
              </TouchableOpacity>
              <CustomText fontFamily={'pop'} style={[styles.modalTitle, { color: isDarkMode ? 'white' : 'black' }]}>
                Uygulama Dili
              </CustomText>
            </View>

            <FlatList
              data={languages}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <LanguageItem
                  language={item}
                  isSelected={currentLanguage === item.code}
                  onPress={() => handleLanguageSelect(item)}
                  isDarkMode={isDarkMode}
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
