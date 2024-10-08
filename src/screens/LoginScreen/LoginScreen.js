import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Animated } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import CustomText from '../../components/CustomText';
import { GoogleSignin } from '@react-native-community/google-signin';
import AuthButton from '../../components/AuthButton';
import auth from '@react-native-firebase/auth';
import { StatusBar } from 'expo-status-bar';
import useNavigationBarSync from '../../hooks/useNavigationBarSync';
import { useTranslation } from 'react-i18next';
const { width, height } = Dimensions.get('window');

const colors = ['#361f34', '#005657', '#ff25ff', '#2c014d', '#fff0d3', '#ff6655'];
const textColors = ['#e1f1ff', '#ffc480', '#000000', '#3cf467', '#0000ff', '#3c3cd6'];

const AnimatedGradientText = ({ text, textColor }) => (
  <CustomText fontFamily="pop">
    <Animated.Text style={[styles.text, { color: textColor }]}>
      {text}
    </Animated.Text>
  </CustomText>
);

const LoginScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  useNavigationBarSync('black');
  const texts = t('texts', { returnObjects: true });

  const [currentText, setCurrentText] = useState('Let\'s work together');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGoogleBounce, setShowGoogleBounce] = useState(false);
  const [showPhoneBounce, setShowPhoneBounce] = useState(false);
  const [showEmailBounce, setShowEmailBounce] = useState(false);
  
  const textColor = useRef(new Animated.Value(0)).current;
  const animation = useRef(new Animated.Value(0)).current;

  const animations = colors.map((_, index) => {
    return Animated.sequence([
      Animated.parallel([
        Animated.timing(animation, {
          toValue: index + 1,
          duration: 450,
          useNativeDriver: false,
        }),
        Animated.timing(textColor, {
          toValue: index + 1,
          duration: 450,
          useNativeDriver: false,
        }),
      ]),
      Animated.delay(2000),
    ]);
  });

  useEffect(() => {
    let animationLoop;
    if (isFocused) {
      animationLoop = Animated.loop(Animated.sequence(animations));
      animationLoop.start();
    }

    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
    };
  }, [isFocused]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '737402285801-hc9fhhs4mlqelvth26l3kv6p8g0ngr06.apps.googleusercontent.com'
    });

    const interval = setInterval(() => {
      setCurrentText((prev) => {
        const currentIndex = texts.findIndex(text => text === prev);
        const nextIndex = (currentIndex + 1) % texts.length;
        return texts[nextIndex];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const interpolateBackgroundColor = animation.interpolate({
    inputRange: [0, ...colors.map((_, index) => index + 1), colors.length + 1],
    outputRange: [colors[colors.length - 1], ...colors, colors[0]],
  });

  const interpolateTextColor = textColor.interpolate({
    inputRange: [0, ...textColors.map((_, index) => index + 1), textColors.length + 1],
    outputRange: [textColors[textColors.length - 1], ...textColors, textColors[0]],
  });

  const signIn = async () => {
    try {
      await GoogleSignin.signOut(); 
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(user.idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      navigation.navigate('UserInfoScreen', { uid: userCredential.user.uid, loginMethod: 'google' }); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleTwitterPress = () => {
    setIsAnimating(true);
    setShowEmailBounce(true);
    setTimeout(() => {
      setShowEmailBounce(false);
      navigation.navigate('EmailLogin');
      setIsAnimating(false);
    }, 666);
  };

  const handlePhonePress = () => {
    setIsAnimating(true);
    setShowPhoneBounce(true);
    setTimeout(() => {
      setShowPhoneBounce(false);
      navigation.navigate('PhoneLoginScreen');
      setIsAnimating(false);
    }, 666);
  };

  const handleGooglePress = () => {
    setIsAnimating(true);
    setShowGoogleBounce(true);
    setTimeout(async () => {
      setShowGoogleBounce(false);
      await signIn();
      setIsAnimating(false);
    }, 666);
  };

  return (
    <Animated.View style={[styles.appContainer, { backgroundColor: interpolateBackgroundColor }]}>
      <StatusBar style="auto" />
      <AnimatedGradientText text={currentText} textColor={interpolateTextColor} />
      <View style={styles.buttonContainer}>
        <AuthButton
          style={styles.googleButton}
          iconName="google"
          text={t("googleButton")}
          onPress={isAnimating ? null : handleGooglePress}
          showBounce={showGoogleBounce}
          bounceColor="#2f2f2f"
          disabled={isAnimating}
        />
        <AuthButton
          style={[styles.twitterButton, isAnimating && { opacity: 0.5 }]}
          iconName="envelope"
          text={t("twitterButton")}
          onPress={isAnimating ? null : handleTwitterPress}
          bounceColor="#e6e6e6"
          showBounce={showEmailBounce}
          disabled={isAnimating}
        />
        <View style={styles.separator} />
        <AuthButton
          style={styles.button}
          iconName="phone"
          text={t("phoneButton")}
          onPress={isAnimating ? null : handlePhonePress}
          showBounce={showPhoneBounce}
          disabled={isAnimating}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: width * 0.08,
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
    bottom: height * 0.05,
    width: '100%',
    paddingHorizontal: width * 0.05,
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
  },
  twitterAnimation: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
});

export default LoginScreen;
