import { useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useNavigationBarContext } from '../context/NavigationBarContext';

const useNavigationBarSync = (backgroundColor) => {
  const { setBackgroundColor } = useNavigationBarContext();
  const navigation = useNavigation();

  useFocusEffect(() => {
    
    if (backgroundColor) {
      setBackgroundColor(backgroundColor);
    }
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Optional: Reset the background color when the screen loses focus
      setBackgroundColor('defaultColor'); // Replace with your default color
    });

    return unsubscribe;
  }, [navigation, backgroundColor]);
};

export default useNavigationBarSync;
