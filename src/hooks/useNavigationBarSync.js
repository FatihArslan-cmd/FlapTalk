import { useEffect } from 'react';
import { useNavigationBarContext } from '../context/NavigationBarContext';
const useNavigationBarSync = (backgroundColor) => {
  const { setBackgroundColor } = useNavigationBarContext();

  useEffect(() => {
    if (backgroundColor) {
      setBackgroundColor(backgroundColor);
    }
  }, [backgroundColor]);
};

export default useNavigationBarSync;
