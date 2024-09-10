import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import {
  RTCView,
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';

const VideoCallScreen = ({ route, navigation }) => {
  const { chatId, userId, isCaller } = route.params; // isCaller'ı buradan alıyoruz
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const pc = useRef(new RTCPeerConnection()).current;

  const roomRef = firestore().collection('rooms').doc(chatId);

  useEffect(() => {
    const startLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        // Add the local stream to the peer connection
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Setup ICE candidates
        pc.onicecandidate = event => {
          if (event.candidate) {
            roomRef.collection('candidates').add(event.candidate.toJSON());
          }
        };

        // Handle remote stream
        pc.ontrack = event => {
          setRemoteStream(event.streams[0]);
        };
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    const createRoom = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(new RTCSessionDescription(offer));

      const roomWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      await roomRef.set(roomWithOffer);

      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answer = new RTCSessionDescription(data.answer);
          await pc.setRemoteDescription(answer);
        }
      });

      roomRef.collection('candidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    };

    const joinRoom = async () => {
      const roomSnapshot = await roomRef.get();
      const roomData = roomSnapshot.data();
      if (roomData?.offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(roomData.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(new RTCSessionDescription(answer));

        const roomWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        await roomRef.update(roomWithAnswer);

        roomRef.collection('candidates').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'added') {
              const candidate = new RTCIceCandidate(change.doc.data());
              pc.addIceCandidate(candidate);
            }
          });
        });
      }
    };

    // Başlatma
    startLocalStream();

    if (isCaller) {
      createRoom();
    } else {
      joinRoom();
    }

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      pc.close();
    };
  }, [isCaller]);

  return (
    <View style={styles.container}>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={styles.localVideo}  />
      )}
      {remoteStream && (
        <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo}  />
      )}
      <Button title="End Call" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideo: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 20,
    right: 20,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
  },
});

export default VideoCallScreen;
