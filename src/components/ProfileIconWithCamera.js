import React from 'react';
import { View, Image, StyleSheet, Dimensions,TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

const ProfileIconWithCamera = ({ avatarUri, onCameraPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
      <TouchableOpacity onPress={onCameraPress}>
        <Image 
          source={avatarUri ? { uri: avatarUri } : {uri: 'https://github.com/bhavik66/react-native-firebase-chat/blob/master/src/img/profile.png?raw=true'}}
          style={styles.profileIcon}
        />
         </TouchableOpacity>
        <View style={styles.cameraContainer}>
          <TouchableOpacity onPress={onCameraPress}>
            <Image 
              source={require('../../assets/photo-camera-interface-symbol-for-button.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
  },
  profileIcon: {
    width: height * 0.18,
    height: height * 0.18,
    borderRadius: (height * 0.12) / 2,
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: (width * 0.08) / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: width * 0.08,
    height: width * 0.08,
  },
});

export default ProfileIconWithCamera;
