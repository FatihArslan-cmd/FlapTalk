import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

const { width } = Dimensions.get('window');

const ProfileIconWithCamera = ({ avatarUri, onCameraPress, avatarSize }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.profileContainer, { width: avatarSize, height: avatarSize }]}>
        <TouchableOpacity onPress={onCameraPress}>
          <FastImage
            source={avatarUri ? { uri: avatarUri } : { uri: 'https://github.com/bhavik66/react-native-firebase-chat/blob/master/src/img/profile.png?raw=true' }}
            style={[styles.profileIcon, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <View style={[styles.cameraContainer, { width: avatarSize * 0.3, height: avatarSize * 0.3, borderRadius: (avatarSize * 0.3) / 2 }]}>
          <TouchableOpacity onPress={onCameraPress}>
            <FastImage
              source={require('../../assets/photo-camera-interface-symbol-for-button.png')}
              style={[styles.cameraIcon, { width: avatarSize * 0.3, height: avatarSize * 0.3 }]}
              resizeMode={FastImage.resizeMode.cover}
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
    resizeMode: 'cover',
  },
  cameraContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    resizeMode: 'cover',
  },
});

export default ProfileIconWithCamera;
