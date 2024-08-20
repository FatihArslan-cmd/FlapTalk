import React, { useEffect, useRef, useReducer } from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedStyle, withTiming, useDerivedValue } from 'react-native-reanimated';
import Lottie from 'lottie-react-native';
import AppHomePage from '../AppHomePage';
import CommunityScreen from '../CommunityScreen.js/CommunityScreen';
import CallsScreen from '../CallsScreen/CallsScreen';
import SettingScreen from '../settings/SettingScreen';
import { StatusBar } from 'expo-status-bar';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const Tab = createMaterialTopTabNavigator();

const TabNavigator = () => {
  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <StatusBar style="auto" />
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabBar {...props} />}
        swipeEnabled={true} // Enable swipe gestures
        tabBarPosition="bottom" // Position the tab bar at the bottom
        screenOptions={{
          tabBarShowIcon: true,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#00ae59',
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={AppHomePage}
          options={{
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                source={require('../../assets/lottie/home.icon.json')}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Community"
          component={CommunityScreen}
          options={{
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                source={require('../../assets/lottie/chat.icon.json')}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Calls"
          component={CallsScreen}
          options={{
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                source={require('../../assets/lottie/Call.json')}
                style={styles.icon}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            tabBarIcon: ({ ref }) => (
              <Lottie
                ref={ref}
                loop={false}
                source={require('../../assets/lottie/settings.icon.json')}
                style={styles.icon}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const AnimatedTabBar = ({ state: { index: activeIndex, routes }, navigation, descriptors }) => {
  const reducer = (state, action) => {
    return [...state, { x: action.x, index: action.index }];
  };

  const [layout, dispatch] = useReducer(reducer, []);

  const handleLayout = (event, index) => {
    dispatch({ x: event.nativeEvent.layout.x, index });
  };

  const xOffset = useDerivedValue(() => {
    if (layout.length !== routes.length) return 0;
    return [...layout].find(({ index }) => index === activeIndex).x - 25;
  }, [activeIndex, layout]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withTiming(xOffset.value, { duration: 250 }) }],
    };
  });

  return (
    <View style={styles.tabBar}>
      <AnimatedSvg
        width={110}
        height={60}
        viewBox="0 0 110 60"
        style={[styles.activeBackground, animatedStyles]}
      >
        <Path
          fill="#00ae59"
          d="M20 0H0c11.046 0 20 8.953 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.045 8.954-20 20-20H20z"
        />
      </AnimatedSvg>

      <View style={styles.tabBarContainer}>
        {routes.map((route, index) => {
          const active = index === activeIndex;
          const { options } = descriptors[route.key];

          return (
            <TabBarComponent
              key={route.key}
              active={active}
              options={options}
              onLayout={(e) => handleLayout(e, index)}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

const TabBarComponent = ({ active, options, onLayout, onPress }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (active && ref?.current) {
      ref.current.play();
    }
  }, [active]);

  const animatedComponentCircleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(active ? 1 : 0, { duration: 250 })
        }
      ]
    };
  });

  const animatedIconContainerStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(active ? 1 : 0.5, { duration: 250 })
    };
  });

  return (
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
      <Animated.View
        style={[styles.componentCircle, animatedComponentCircleStyles]}
      />
      <Animated.View style={[styles.iconContainer, animatedIconContainerStyles]}>
        {options.tabBarIcon ? options.tabBarIcon({ ref }) : <Text>?</Text>}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 36,
    width: 36,
  }
});

export default TabNavigator;
