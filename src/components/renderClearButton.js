import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ClearButton = ({ value, setValue, iconColor = '#888', iconSize = 20 }) => {
  if (!value) return null;

  return (
    <TouchableOpacity onPress={() => setValue('')} style={styles.clearButton}>
      <Icon name="clear" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  clearButton: {
    padding: 5,
  },
});

export default ClearButton;
