import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-community/google-signin';
import * as Animatable from 'react-native-animatable';
import AuthButton from './AuthButton';

const AnimatedGradientText = ({ text, textColor }) => (
  <CustomText style={[styles.text, { color: textColor }]}>
    {text}
  </CustomText>
);

const LoginScreen = () => {
  const navigation = useNavigation();
  const [currentText, setCurrentText] = useState('Hadi birlikte çalışalım');
  const [backgroundColor, setBackgroundColor] = useState('#190849');
  const [textColor, setTextColor] = useState('#d7cc00');
  const [useDefaultColors, setUseDefaultColors] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [showTwitterAnimation, setShowTwitterAnimation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGoogleBounce, setShowGoogleBounce] = useState(false);
  const [showPhoneBounce, setShowPhoneBounce] = useState(false);

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
    setShowPhoneBounce(true);
    setTimeout(() => {
      setShowPhoneBounce(false);
      navigation.navigate('PhoneLoginScreen');
    }, 1500);
  };

  const handleGooglePress = () => {
    setShowGoogleBounce(true);
    setTimeout(async () => {
      setShowGoogleBounce(false);
      await signIn();
    }, 1500);
  };

  const { height } = Dimensions.get('window');

  return (
    <View style={[styles.appContainer, { backgroundColor }]}>
      <AnimatedGradientText text={currentText} textColor={textColor} />
      <View style={styles.buttonContainer}>
        <AuthButton
          style={styles.googleButton}
          iconName="google"
          text="Google ile devam et"
          onPress={handleGooglePress}
          showBounce={showGoogleBounce}
          bounceColor="#2f2f2f"
        />
        <AuthButton
          style={[styles.twitterButton, isAnimating && { opacity: 0.5 }]}
          iconName="twitter"
          text="Twitter ile devam et"
          onPress={isAnimating ? null : handleTwitterPress}
          showBounce={false}
          bounceColor="#e6e6e6"
          disabled={isAnimating}
        />
        <View style={styles.separator} />
        <AuthButton
          style={styles.button}
          iconName="phone"
          text="Telefon numarası ile devam et"
          onPress={handlePhonePress}
          showBounce={showPhoneBounce}
        />
      </View>
      {showTwitterAnimation && (
        <Animatable.View
          animation="fadeInUpBig"
          iterationCount={1}
          direction="alternate"
          style={[styles.twitterAnimation, { top: height / 2 - 50 }]}
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
  googleButton: {
    backgroundColor: '#e6e6e6',
  },
  twitterButton: {
    backgroundColor: '#2f2f2f',
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
