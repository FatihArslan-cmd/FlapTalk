import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-community/google-signin';
import * as Animatable from 'react-native-animatable';

const AnimatedGradientText = ({ text, textColor }) => {
  return (
    <CustomText style={[styles.text, { color: textColor }]}>
      {text}
    </CustomText>
  );
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [currentText, setCurrentText] = useState('Hadi birlikte çalışalım');
  const [backgroundColor, setBackgroundColor] = useState('#190849');
  const [textColor, setTextColor] = useState('#d7cc00');
  const [useDefaultColors, setUseDefaultColors] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [showTwitterAnimation, setShowTwitterAnimation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Add state for animation

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '737402285801-hc9fhhs4mlqelvth26l3kv6p8g0ngr06.apps.googleusercontent.com'
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user);
      navigation.navigate('AppHomePage', { userInfo: user });
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleTwitterPress = () => {
    setShowTwitterAnimation(true);
    setIsAnimating(true);
  };

  const handlePhonePress = () => {
    navigation.navigate('PhoneLoginScreen');
  };

  const { height } = Dimensions.get('window');

  return (
    <View style={[styles.appContainer, { backgroundColor }]}>
      <AnimatedGradientText text={currentText} textColor={textColor} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={signIn}>
          <Icon name="google" size={20} color="#2f2f2f" style={styles.icon} />
          <Text style={styles.googleButtonText}>Google ile devam et</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.twitterButton, isAnimating && { opacity: 0.5 }]} // Dim the button when animating
          onPress={isAnimating ? null : handleTwitterPress} // Disable button press during animation
          disabled={isAnimating} // Disable button interaction
        >
          <Icon name="twitter" size={20} color="#e6e6e6" style={styles.icon} />
          <Text style={styles.twitterButtonText}>Twitter ile devam et</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.button} onPress={handlePhonePress}>
          <Icon name="phone" size={20} color="#e6e6e6" style={styles.icon} />
          <Text style={styles.buttonText}>Telefon numarası ile devam et</Text>
        </TouchableOpacity>
      </View>
      {showTwitterAnimation && (
        <Animatable.View
          animation="fadeInUpBig"
          iterationCount={1}
          direction="alternate"
          style={[styles.twitterAnimation, { top: height / 2 - 50 }]} // Center the icon
          onAnimationEnd={() => {
            setShowTwitterAnimation(false);
            setIsAnimating(false);
          }}
        >
          <Icon name="twitter" size={100} color="#1DA1F2" />
        </Animatable.View>
      )}
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
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#0d0d0d',
    borderRadius: 30,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#e6e6e6',
    borderRadius: 30,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  twitterButton: {
    backgroundColor: '#2f2f2f',
    borderRadius: 30,
    paddingVertical: 10,
    marginVertical: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#e6e6e6',
    fontSize: 18,
    marginLeft: 10,
  },
  googleButtonText: {
    color: '#2f2f2f',
    fontSize: 18,
    marginLeft: 10,
  },
  twitterButtonText: {
    color: '#e6e6e6',
    fontSize: 18,
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  separator: {
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  twitterAnimation: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%'
  },
});

export default LoginScreen;
