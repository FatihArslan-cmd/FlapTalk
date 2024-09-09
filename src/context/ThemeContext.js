import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Manage dark theme and light theme
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemePreference = await AsyncStorage.getItem('themePreference');
        if (savedThemePreference) {
          setIsDarkMode(savedThemePreference === 'dark');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };

    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newThemePreference = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);

    try {
      await AsyncStorage.setItem('themePreference', newThemePreference);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  // Optimize with useMemo to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
    }),
    [isDarkMode] // Memoize only when isDarkMode changes
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
