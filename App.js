import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import CustomText from './src/CustomText';

const AnimatedGradientText = ({ text, isDisappearing, textColor }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDisappearing ? 0 : 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [isDisappearing]);

  const animatedText = text.split('').map((char, index) => (
    <Animated.Text key={index} style={{ color: textColor, opacity: animatedValue }}>
      {char}
    </Animated.Text>
  ));

  return (
    <CustomText style={styles.text}>
      {animatedText}
    </CustomText>
  );
};

const App = () => {
  const [isDisappearing, setIsDisappearing] = useState(true);
  const [currentText, setCurrentText] = useState('Hadi birlikte çalışalım');
  const [backgroundColor, setBackgroundColor] = useState('#190849');
  const [textColor, setTextColor] = useState('#d7cc00');
  const [useDefaultColors, setUseDefaultColors] = useState(true);

  const defaultColors = [
    { text: 'Hadi birlikte çalışalım', backgroundColor: '#190849', textColor: '#d7cc00' },
    { text: 'Mesajlaşma uygulaması', backgroundColor: '#d1ffd5', textColor: '#ff83ff' },
    { text: 'FlapTalk', backgroundColor: '#ff25ff', textColor: '#000000' }
  ];

  const newColors = [
    { text: 'Hadi birlikte çalışalım', backgroundColor: '#2c014d', textColor: '#3aa05f' },
    { text: 'Mesajlaşma uygulaması', backgroundColor: '#361f34', textColor: '#8a8597' },
    { text: 'FlapTalk', backgroundColor: '#ff6655', textColor: '#3c3cd6' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsDisappearing((prev) => !prev);
      setCurrentText((prev) => {
        const colors = useDefaultColors ? defaultColors : newColors;
        const currentIndex = colors.findIndex(item => item.text === prev);
        const nextIndex = (currentIndex + 1) % colors.length;

        if (nextIndex === 0) {
          setUseDefaultColors(prev => !prev);
        }

        setBackgroundColor(colors[nextIndex].backgroundColor);
        setTextColor(colors[nextIndex].textColor);
        return colors[nextIndex].text;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [useDefaultColors]);

  return (
    <View style={[styles.appContainer, { backgroundColor }]}>
      <AnimatedGradientText text={currentText} isDisappearing={isDisappearing} textColor={textColor} />
      {/* Add other components like buttons here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  appContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
